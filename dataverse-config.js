// Dataverse Configuration for Mobil Helsedata
// Update these values with your actual Dataverse environment details

const DATAVERSE_CONFIG = {
  // Your actual Dataverse environment URL
  environmentUrl: 'https://gunnarpowerai.api.crm4.dynamics.com',
  
  // API version
  apiVersion: '9.2',
  
  // Environment details
  environmentUniqueName: 'unq1bc363ccd887ef11ac1e000d3ab8d',
  environmentId: 'd28e47b4-ad66-ea3e-b483-d348d5e5b051',
  organizationId: '1bc363cc-d887-ef11-ac1e-000d3ab8db5a',
  
  // Custom entities for storing data
  entities: {
    mobilHelsedata: 'crd12_testhelsedatas'
  },
  
  // Field mappings for mobil helsedata entity
  fields: {
    data: 'crd12_data',           // JSON field for all data (you may need to create this field)
    id: 'crd12_id',               // Primary name field
    primaryId: 'crd12_testhelsedataid', // Primary ID field
    createdOn: 'createdon',        // Auto-generated timestamp
    modifiedOn: 'modifiedon',     // Auto-generated timestamp
    ownerId: 'ownerid',           // Auto-generated owner
    stateCode: 'statecode',       // Auto-generated state
    statusCode: 'statuscode'      // Auto-generated status
  }
};

// Instructions for setting up Dataverse entities:
/*
1. Go to Power Platform Admin Center
2. Create a new environment with Dataverse
3. Create custom entities:

   Location Data Entity (mhl_locationdatas):
   - mhl_latitude (Decimal)
   - mhl_longitude (Decimal)
   - mhl_accuracy (Decimal)
   - mhl_timestamp (DateTime)
   - mhl_userid (Single Line of Text)

   Health Data Entity (mhl_healthdatas):
   - mhl_selectedtypes (Multiple Lines of Text)
   - mhl_healthdata (Multiple Lines of Text)
   - mhl_lastupdated (DateTime)
   - mhl_timestamp (DateTime)
   - mhl_userid (Single Line of Text)

4. Update the environmentUrl above with your actual environment URL
5. Grant appropriate permissions to your Azure AD app for Dataverse
*/

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
  module.exports = DATAVERSE_CONFIG;
} else {
  window.DATAVERSE_CONFIG = DATAVERSE_CONFIG;
}
