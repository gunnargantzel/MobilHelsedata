// Mobil Helsedata PWA JavaScript

class MobilHelsedataApp {
  constructor() {
    this.locationPermission = null;
    this.healthDataSelection = new Set();
    this.locationData = null;
    this.healthData = null;
    
    this.init();
  }

  async init() {
    // Register service worker
    if ('serviceWorker' in navigator) {
      try {
        await navigator.serviceWorker.register('/sw.js');
        console.log('Service Worker registered successfully');
      } catch (error) {
        console.error('Service Worker registration failed:', error);
      }
    }

    // Setup event listeners
    this.setupEventListeners();
    
    // Check for install prompt
    this.setupInstallPrompt();
    
    // Initialize UI state
    this.updateUI();
  }

  setupEventListeners() {
    // Location permission button
    document.getElementById('location-btn').addEventListener('click', () => {
      this.requestLocationPermission();
    });

    // Health data button
    document.getElementById('health-btn').addEventListener('click', () => {
      this.openHealthModal();
    });

    // Modal controls
    document.getElementById('close-modal').addEventListener('click', () => {
      this.closeHealthModal();
    });

    document.getElementById('cancel-health').addEventListener('click', () => {
      this.closeHealthModal();
    });

    document.getElementById('confirm-health').addEventListener('click', () => {
      this.confirmHealthSelection();
    });

    // Install prompt
    document.getElementById('install-btn').addEventListener('click', () => {
      this.installApp();
    });

    document.getElementById('dismiss-install').addEventListener('click', () => {
      this.dismissInstallPrompt();
    });

    // Share data button
    document.getElementById('share-data').addEventListener('click', () => {
      this.shareData();
    });

    // Close modal when clicking outside
    document.getElementById('health-modal').addEventListener('click', (e) => {
      if (e.target.id === 'health-modal') {
        this.closeHealthModal();
      }
    });
  }

  async requestLocationPermission() {
    const button = document.getElementById('location-btn');
    const status = document.getElementById('location-status');
    
    button.disabled = true;
    button.textContent = 'Behandler...';
    
    try {
      if (!navigator.geolocation) {
        throw new Error('Geolocation er ikke støttet av denne nettleseren');
      }

      // Request permission and get current location
      const position = await this.getCurrentPosition();
      
      this.locationPermission = 'granted';
      this.locationData = {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        accuracy: position.coords.accuracy,
        timestamp: new Date().toISOString()
      };

      this.updateLocationStatus('granted');
      this.updateUI();
      
    } catch (error) {
      console.error('Location error:', error);
      this.locationPermission = 'denied';
      this.updateLocationStatus('denied');
      this.showNotification('Kunne ikke få tilgang til lokasjon. Vennligst sjekk nettleserinnstillingene.', 'error');
    }
    
    button.disabled = false;
    button.textContent = 'Be om tillatelse';
  }

  getCurrentPosition() {
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(resolve, reject, {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000 // 5 minutes
      });
    });
  }

  updateLocationStatus(status) {
    const statusElement = document.getElementById('location-status');
    const indicator = statusElement.querySelector('.status-indicator');
    const text = statusElement.querySelector('.status-text');
    
    indicator.className = `status-indicator ${status}`;
    
    switch (status) {
      case 'granted':
        text.textContent = 'Gitt';
        break;
      case 'denied':
        text.textContent = 'Avslått';
        break;
      default:
        text.textContent = 'Ikke gitt';
    }
  }

  openHealthModal() {
    document.getElementById('health-modal').style.display = 'block';
    document.body.style.overflow = 'hidden';
  }

  closeHealthModal() {
    document.getElementById('health-modal').style.display = 'none';
    document.body.style.overflow = 'auto';
  }

  confirmHealthSelection() {
    const checkboxes = document.querySelectorAll('#health-modal input[type="checkbox"]:checked');
    this.healthDataSelection.clear();
    
    checkboxes.forEach(checkbox => {
      this.healthDataSelection.add(checkbox.value);
    });

    if (this.healthDataSelection.size > 0) {
      this.updateHealthStatus('granted');
      this.simulateHealthDataCollection();
    } else {
      this.showNotification('Vennligst velg minst én type helsedata', 'warning');
      return;
    }

    this.closeHealthModal();
    this.updateUI();
  }

  updateHealthStatus(status) {
    const statusElement = document.getElementById('health-status');
    const indicator = statusElement.querySelector('.status-indicator');
    const text = statusElement.querySelector('.status-text');
    
    indicator.className = `status-indicator ${status}`;
    
    switch (status) {
      case 'granted':
        text.textContent = `${this.healthDataSelection.size} valgt`;
        break;
      case 'denied':
        text.textContent = 'Avslått';
        break;
      default:
        text.textContent = 'Ikke gitt';
    }
  }

  simulateHealthDataCollection() {
    // Simulate Apple Health data collection
    // In a real implementation, this would use the HealthKit API
    this.healthData = {
      selectedTypes: Array.from(this.healthDataSelection),
      lastUpdated: new Date().toISOString(),
      data: this.generateSampleHealthData()
    };
  }

  generateSampleHealthData() {
    const data = {};
    
    this.healthDataSelection.forEach(type => {
      switch (type) {
        case 'heartRate':
          data.heartRate = { value: 72, unit: 'bpm', timestamp: new Date().toISOString() };
          break;
        case 'steps':
          data.steps = { value: 8542, unit: 'steps', timestamp: new Date().toISOString() };
          break;
        case 'distance':
          data.distance = { value: 6.2, unit: 'km', timestamp: new Date().toISOString() };
          break;
        case 'activeEnergy':
          data.activeEnergy = { value: 420, unit: 'kcal', timestamp: new Date().toISOString() };
          break;
        case 'weight':
          data.weight = { value: 70.5, unit: 'kg', timestamp: new Date().toISOString() };
          break;
        case 'sleepAnalysis':
          data.sleepAnalysis = { value: 7.5, unit: 'hours', timestamp: new Date().toISOString() };
          break;
        default:
          data[type] = { value: 'Sample data', unit: 'unit', timestamp: new Date().toISOString() };
      }
    });
    
    return data;
  }

  updateUI() {
    // Enable buttons based on permissions
    const locationBtn = document.getElementById('location-btn');
    const healthBtn = document.getElementById('health-btn');
    
    locationBtn.disabled = this.locationPermission === 'granted';
    healthBtn.disabled = this.healthDataSelection.size > 0;

    // Show data summary if we have data
    const dataSummary = document.getElementById('data-summary');
    if (this.locationData || this.healthData) {
      dataSummary.style.display = 'block';
      this.updateDataSummary();
    } else {
      dataSummary.style.display = 'none';
    }
  }

  updateDataSummary() {
    const locationSummary = document.getElementById('location-summary');
    const healthSummary = document.getElementById('health-summary');

    if (this.locationData) {
      locationSummary.textContent = `Lat: ${this.locationData.latitude.toFixed(4)}, Lng: ${this.locationData.longitude.toFixed(4)}`;
    } else {
      locationSummary.textContent = 'Ingen data';
    }

    if (this.healthData && this.healthDataSelection.size > 0) {
      healthSummary.textContent = `${this.healthDataSelection.size} typer valgt: ${Array.from(this.healthDataSelection).join(', ')}`;
    } else {
      healthSummary.textContent = 'Ingen data valgt';
    }
  }

  async shareData() {
    if (!this.locationData && !this.healthData) {
      this.showNotification('Ingen data å dele', 'warning');
      return;
    }

    const userId = this.getUserId();
    const shareData = {
      userId,
      location: this.locationData,
      health: this.healthData,
      timestamp: new Date().toISOString(),
      appVersion: '1.0.0'
    };

    try {
      // Send data to backend
      const response = await this.sendDataToBackend(shareData);
      
      if (response.success) {
        this.showNotification('Data sendt til server!', 'success');
        
        // Also offer native sharing
        if (navigator.share) {
          await navigator.share({
            title: 'Mobil Helsedata',
            text: `Helsedata samlet: ${this.healthDataSelection.size} typer, Lokasjon: ${this.locationData ? 'Ja' : 'Nei'}`,
            url: window.location.href
          });
        }
      } else {
        throw new Error('Server rejected data');
      }
    } catch (error) {
      console.error('Share error:', error);
      
      // Fallback: copy to clipboard
      try {
        await navigator.clipboard.writeText(JSON.stringify(shareData, null, 2));
        this.showNotification('Data kopiert til utklippstavle (server ikke tilgjengelig)', 'warning');
      } catch (clipboardError) {
        this.showNotification('Kunne ikke dele data', 'error');
      }
    }
  }

  getUserId() {
    // Generate or retrieve user ID
    let userId = localStorage.getItem('mobilHelsedata_userId');
    if (!userId) {
      userId = 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
      localStorage.setItem('mobilHelsedata_userId', userId);
    }
    return userId;
  }

  async sendDataToBackend(data) {
    const API_BASE_URL = window.location.origin.includes('localhost') 
      ? 'http://localhost:3000' 
      : window.location.origin;

    try {
      const response = await fetch(`${API_BASE_URL}/api/combined-data`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Backend communication error:', error);
      throw error;
    }
  }

  setupInstallPrompt() {
    let deferredPrompt;
    
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      deferredPrompt = e;
      document.getElementById('install-prompt').style.display = 'block';
    });

    window.addEventListener('appinstalled', () => {
      document.getElementById('install-prompt').style.display = 'none';
      this.showNotification('Appen er installert!', 'success');
    });
  }

  async installApp() {
    if (window.deferredPrompt) {
      window.deferredPrompt.prompt();
      const { outcome } = await window.deferredPrompt.userChoice;
      
      if (outcome === 'accepted') {
        console.log('User accepted the install prompt');
      } else {
        console.log('User dismissed the install prompt');
      }
      
      window.deferredPrompt = null;
      document.getElementById('install-prompt').style.display = 'none';
    }
  }

  dismissInstallPrompt() {
    document.getElementById('install-prompt').style.display = 'none';
  }

  showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    // Style the notification
    Object.assign(notification.style, {
      position: 'fixed',
      top: '20px',
      left: '50%',
      transform: 'translateX(-50%)',
      background: type === 'error' ? '#ef4444' : type === 'warning' ? '#f59e0b' : '#10b981',
      color: 'white',
      padding: '12px 24px',
      borderRadius: '8px',
      fontSize: '14px',
      fontWeight: '500',
      zIndex: '1000',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
      maxWidth: '90%',
      textAlign: 'center'
    });

    document.body.appendChild(notification);

    // Remove notification after 3 seconds
    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification);
      }
    }, 3000);
  }
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new MobilHelsedataApp();
});

// Handle online/offline status
window.addEventListener('online', () => {
  console.log('App is online');
});

window.addEventListener('offline', () => {
  console.log('App is offline');
});

// Handle app visibility changes
document.addEventListener('visibilitychange', () => {
  if (document.hidden) {
    console.log('App is hidden');
  } else {
    console.log('App is visible');
  }
});
