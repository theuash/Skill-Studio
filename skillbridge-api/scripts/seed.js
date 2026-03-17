require('dotenv').config();
const mongoose = require('mongoose');
const Sector = require('../models/Sector');
const Company = require('../models/Company');
const Job = require('../models/Job');
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

    // ─── Jobs ─────────────────────────────────────────────────────────────────
    console.log('💼 Seeding jobs...');

    const daysAgo = (n) => {
      const d = new Date()
      d.setDate(d.getDate() - n)
      return d
    }

    const sampleJobs = [
      {
        title: 'Senior Frontend Developer',
        company: 'Google',
        description: 'We are looking for a Senior Frontend Developer to join our dynamic team. You will be responsible for building responsive web applications using React, TypeScript, and modern CSS frameworks.',
        location: 'San Francisco, CA',
        type: 'Full-time',
        experienceLevel: 'Senior Level',
        salary: '$120,000 - $160,000',
        requirements: ['5+ years React experience', 'TypeScript', 'CSS/SCSS', 'Git'],
        tags: ['React', 'TypeScript', 'JavaScript', 'CSS', 'Frontend'],
        applicants: 23,
        postedAt: daysAgo(2),
        sector: 'Tech'
      },
      {
        title: 'Full Stack Engineer',
        company: 'Meta',
        description: 'Join our engineering team to build scalable web applications. You will work on both frontend and backend technologies, collaborating with product managers and designers.',
        location: 'New York, NY',
        type: 'Full-time',
        experienceLevel: 'Mid Level',
        salary: '$90,000 - $130,000',
        requirements: ['3+ years full stack experience', 'Node.js', 'React', 'MongoDB'],
        tags: ['Node.js', 'React', 'MongoDB', 'Express', 'Full Stack'],
        applicants: 45,
        postedAt: daysAgo(7),
        sector: 'Tech'
      },
      {
        title: 'Data Scientist',
        company: 'Netflix',
        description: 'We seek a talented Data Scientist to analyze large datasets and build predictive models. Experience with Python, machine learning libraries, and statistical analysis required.',
        location: 'Remote',
        type: 'Full-time',
        experienceLevel: 'Mid Level',
        salary: '$100,000 - $140,000',
        requirements: ['Python', 'Machine Learning', 'SQL', 'Statistics', 'Pandas'],
        tags: ['Python', 'Machine Learning', 'Data Science', 'SQL', 'Pandas'],
        applicants: 18,
        postedAt: daysAgo(3),
        sector: 'Tech'
      },
      {
        title: 'UX/UI Designer',
        company: 'Shopify',
        description: 'Create beautiful and intuitive user experiences for our web and mobile applications. You will work closely with product teams to design user-centered solutions.',
        location: 'Austin, TX',
        type: 'Full-time',
        experienceLevel: 'Mid Level',
        salary: '$70,000 - $100,000',
        requirements: ['Figma', 'Adobe Creative Suite', 'User Research', 'Prototyping'],
        tags: ['UI/UX', 'Figma', 'Design', 'User Research', 'Prototyping'],
        applicants: 31,
        postedAt: daysAgo(5),
        sector: 'Tech'
      },
      {
        title: 'DevOps Engineer',
        company: 'Airbnb',
        description: 'Manage our cloud infrastructure and CI/CD pipelines. Experience with AWS, Docker, Kubernetes, and infrastructure as code is essential.',
        location: 'Seattle, WA',
        type: 'Full-time',
        experienceLevel: 'Senior Level',
        salary: '$130,000 - $170,000',
        requirements: ['AWS', 'Docker', 'Kubernetes', 'Terraform', 'CI/CD'],
        tags: ['AWS', 'Docker', 'Kubernetes', 'DevOps', 'Terraform'],
        applicants: 12,
        postedAt: daysAgo(1),
        sector: 'Tech'
      },
      {
        title: 'Product Manager',
        company: 'Stripe',
        description: 'Lead product development from ideation to launch. Work with engineering, design, and marketing teams to deliver successful products.',
        location: 'Boston, MA',
        type: 'Full-time',
        experienceLevel: 'Senior Level',
        salary: '$110,000 - $150,000',
        requirements: ['Product Management', 'Agile', 'Analytics', 'Leadership'],
        tags: ['Product Management', 'Agile', 'Analytics', 'Strategy'],
        applicants: 27,
        postedAt: daysAgo(4),
        sector: 'Tech'
      },
      {
        title: 'Mobile App Developer',
        company: 'Vercel',
        description: 'Develop native mobile applications for iOS and Android. Experience with React Native or Flutter preferred.',
        location: 'Los Angeles, CA',
        type: 'Full-time',
        experienceLevel: 'Mid Level',
        salary: '$85,000 - $120,000',
        requirements: ['React Native', 'iOS', 'Android', 'JavaScript'],
        tags: ['React Native', 'Mobile', 'iOS', 'Android', 'JavaScript'],
        applicants: 19,
        postedAt: daysAgo(6),
        sector: 'Tech'
      },
      {
        title: 'Cybersecurity Analyst',
        company: 'Meta',
        description: 'Protect our systems from cyber threats. Conduct security assessments, monitor for vulnerabilities, and respond to incidents.',
        location: 'Washington, DC',
        type: 'Full-time',
        experienceLevel: 'Mid Level',
        salary: '$95,000 - $125,000',
        requirements: ['Cybersecurity', 'Network Security', 'Risk Assessment', 'Incident Response'],
        tags: ['Cybersecurity', 'Network Security', 'Risk Assessment', 'Compliance'],
        applicants: 15,
        postedAt: daysAgo(3),
        sector: 'Tech'
      }
    ];

    let jobInserted = 0;
    let jobSkipped = 0;

    for (const job of sampleJobs) {
      const existing = await Job.findOne({ title: job.title, company: job.company });
      if (existing) {
        await Job.findOneAndUpdate({ title: job.title, company: job.company }, job);
        jobSkipped++;
        console.log('Updated job:', job.title);
      } else {
        await Job.create(job);
        jobInserted++;
        console.log('Created job:', job.title);
      }
    }
    console.log(`   ✅ ${jobInserted} inserted, ${jobSkipped} updated (${sampleJobs.length} total)\n`);

    // ─── Summary ─────────────────────────────────────────────────────────────
    console.log('📊 Database Summary:');
    const sectorCount = await Sector.countDocuments();
    const companyCount = await Company.countDocuments();
    const jobCount = await Job.countDocuments();
    console.log(`   Sectors:   ${sectorCount}`);
    console.log(`   Companies: ${companyCount}`);
    console.log(`   Jobs:      ${jobCount}`);

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
