require('dotenv').config();
const mongoose = require('mongoose');
const Sector = require('../models/Sector');
const Company = require('../models/Company');
const sectors = require('../data/sectors.json');
const companies = require('../data/companies.json');

const seed = async () => {
  console.log('🌱 SkillBridge Seed Script\n');

  try {
    console.log('📡 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 15000,
    });
    console.log('✅ Connected\n');

    // ─── Sectors ─────────────────────────────────────────────────────────────
    console.log('🗂  Seeding sectors...');
    let sectorInserted = 0;
    let sectorSkipped = 0;

    for (const sector of sectors) {
      const existing = await Sector.findOne({ id: sector.id });
      if (existing) {
        await Sector.findOneAndUpdate({ id: sector.id }, sector, { runValidators: true });
        sectorSkipped++;
      } else {
        await Sector.create(sector);
        sectorInserted++;
      }
    }
    console.log(`   ✅ ${sectorInserted} inserted, ${sectorSkipped} updated (${sectors.length} total)\n`);

    // ─── Companies ───────────────────────────────────────────────────────────
    console.log('🏢 Seeding companies...');
    let companyInserted = 0;
    let companySkipped = 0;

    for (const company of companies) {
      // Attach clearbit logo URL
      company.logo = `https://logo.clearbit.com/${company.domain}`;

      const existing = await Company.findOne({ companyId: company.companyId });
      if (existing) {
        await Company.findOneAndUpdate({ companyId: company.companyId }, company, {
          runValidators: true,
        });
        companySkipped++;
      } else {
        await Company.create(company);
        companyInserted++;
      }
    }
    console.log(`   ✅ ${companyInserted} inserted, ${companySkipped} updated (${companies.length} total)\n`);

    // ─── Summary ─────────────────────────────────────────────────────────────
    console.log('📊 Database Summary:');
    const sectorCount = await Sector.countDocuments();
    const companyCount = await Company.countDocuments();
    console.log(`   Sectors:   ${sectorCount}`);
    console.log(`   Companies: ${companyCount}`);

    // Group companies by sector
    const bysSector = await Company.aggregate([
      { $group: { _id: '$sector', count: { $sum: 1 } } },
      { $sort: { _id: 1 } },
    ]);
    console.log('\n   Companies per sector:');
    bysSector.forEach((s) => {
      const sectorName = sectors.find((sec) => sec.id === s._id)?.name || s._id;
      console.log(`     ${sectorName.padEnd(25)} ${s.count} companies`);
    });

    console.log('\n✨ Seed completed successfully!');
    console.log('\nNext steps:');
    console.log('  1. npm run dev  — start the server');
    console.log('  2. GET /api/health  — verify everything is running');
    console.log('  3. GET /api/sectors  — see all seeded sectors\n');

  } catch (err) {
    console.error('❌ Seed failed:', err.message);
    if (err.code === 'ENOTFOUND' || err.message.includes('connect')) {
      console.error('\n💡 Make sure MONGO_URI in your .env file is correct.');
    }
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  }
};

seed();
