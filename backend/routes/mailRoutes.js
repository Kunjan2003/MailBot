const express = require('express');
const router = express.Router();
const controller = require('../controllers/mailController');
const upload = require('../middleware/upload');

router.post('/send', upload.array('attachments', 5), controller.sendMail);
router.get('/templates', controller.getTemplates);
router.post('/templates', upload.array('attachments', 5), controller.addTemplate);
router.get('/status', controller.getMailStatus);

module.exports = router;
