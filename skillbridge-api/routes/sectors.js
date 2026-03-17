const express = require('express');
const router = express.Router();
const {
  getAllSectors,
  getCompaniesBySector,
  getCompanyById,
  searchCompanies,
} = require('../controllers/sectorController');
const { protect } = require('../middleware/authMiddleware');

// GET /api/sectors
router.get('/', getAllSectors);

// GET /api/sectors/search?q=react
router.get('/search', protect, searchCompanies);

// GET /api/sectors/companies/:companyId
router.get('/companies/:companyId', protect, getCompanyById);

// GET /api/sectors/:sectorId/companies
router.get('/:sectorId/companies', protect, getCompaniesBySector);

module.exports = router;
