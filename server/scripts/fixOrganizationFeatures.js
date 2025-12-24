const mongoose = require('mongoose');
const Organization = require('../models/organizationModel');
require('dotenv').config();

const tierLimits = {
  primary: {
    maxUsers: 100,
    features: ["basic", "attendance"],
  },
  high_school: {
    maxUsers: 500,
    features: ["standard", "chat", "attendance", "exams", "homework", "analytics"],
  },
  university: {
    maxUsers: 2000,
    features: ["premium", "chat", "attendance", "exams", "homework", "analytics", "reports", "support"],
  },
};

async function fixOrganizationFeatures() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || process.env.MONGO_URI);

    console.log('Connected to MongoDB');

    // Get all organizations
    const organizations = await Organization.find({});
    console.log(`Found ${organizations.length} organizations`);

    let updatedCount = 0;

    for (const org of organizations) {
      const correctLimits = tierLimits[org.subscriptionTier];

      if (!correctLimits) {
        console.log(`Unknown tier ${org.subscriptionTier} for organization ${org.name}`);
        continue;
      }

      // Check if features or maxUsers need updating
      const featuresMatch = JSON.stringify(org.features.sort()) === JSON.stringify(correctLimits.features.sort());
      const maxUsersMatch = org.maxUsers === correctLimits.maxUsers;

      if (!featuresMatch || !maxUsersMatch) {
        console.log(`Updating organization ${org.name} (${org.domain}):`);
        console.log(`  Current features: ${org.features.join(', ')}`);
        console.log(`  Correct features: ${correctLimits.features.join(', ')}`);
        console.log(`  Current maxUsers: ${org.maxUsers}`);
        console.log(`  Correct maxUsers: ${correctLimits.maxUsers}`);

        org.features = correctLimits.features;
        org.maxUsers = correctLimits.maxUsers;
        await org.save();
        updatedCount++;
      }
    }

    console.log(`Updated ${updatedCount} organizations`);
    console.log('Feature fix complete');

  } catch (error) {
    console.error('Error fixing organization features:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

fixOrganizationFeatures();
