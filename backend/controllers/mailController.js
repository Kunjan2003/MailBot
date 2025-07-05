
const nodemailer = require('nodemailer');
const Mail = require('../models/Mail');
const Template = require('../models/Template');
const path = require('path');
const fs = require('fs');

exports.sendMail = async (req, res) => {
  try {
    console.log('Received send mail request:', req.body);
    console.log('Files received:', req.files);
    const { to, templateId } = req.body;

    // Validate input
    if (!to || !templateId) {
      return res.status(400).json({ message: 'Email address and template ID are required' });
    }

    const template = await Template.findById(templateId);
    if (!template) {
      return res.status(404).json({ message: 'Template not found' });
    }

    // Prepare attachments array
    let allAttachments = [];

    // Add template attachments
    if (template.attachments && template.attachments.length > 0) {
      allAttachments = [...template.attachments];
    }

    // Add additional attachments from request
    if (req.files && req.files.length > 0) {
      const additionalAttachments = req.files.map(file => ({
        filename: file.filename,
        originalName: file.originalname,
        path: file.path,
        mimetype: file.mimetype,
        size: file.size
      }));
      allAttachments = [...allAttachments, ...additionalAttachments];
    }

    const mail = await Mail.create({
      to,
      subject: template.subject,
      body: template.body,
      attachments: allAttachments
    });

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    // Convert plain text formatting to HTML if needed
    let formattedBody = template.body;

    // Check if the body already contains HTML tags
    const hasHtmlTags = /<[^>]+>/.test(template.body);

    if (!hasHtmlTags) {
      // Convert plain text to HTML
      formattedBody = template.body
        .replace(/\r\n/g, '\n') // Normalize line endings
        .replace(/\n\s*\n/g, '</p><p>') // Double line breaks become paragraph breaks
        .replace(/\n/g, '<br>') // Single line breaks become <br> tags
        .replace(/^/, '<p>') // Add opening paragraph tag at start
        .replace(/$/, '</p>'); // Add closing paragraph tag at end
    }



    // Prepare nodemailer attachments
    const nodemailerAttachments = allAttachments.map(attachment => ({
      filename: attachment.originalName,
      path: attachment.path
    }));

    const mailOptions = {
      from: process.env.FROM_EMAIL,
      to,
      subject: template.subject,
      html: formattedBody,
      attachments: nodemailerAttachments
    };

    transporter.sendMail(mailOptions, (err, info) => {
      if (err) {
        console.error('Email sending error:', err);
        let errorMessage = 'Error sending mail';

        // Provide more specific error messages
        if (err.code === 'EAUTH') {
          errorMessage = 'Email authentication failed. Please check your email credentials or use an App Password for Gmail.';
        } else if (err.code === 'ECONNECTION') {
          errorMessage = 'Failed to connect to email server. Please check your SMTP settings.';
        } else if (err.responseCode === 535) {
          errorMessage = 'Invalid email credentials. For Gmail, you need to use an App Password instead of your regular password.';
        }

        return res.status(500).json({ message: errorMessage, error: err.message });
      }

      console.log('Email sent successfully:', info.messageId);
      res.json({ message: 'Mail sent successfully', messageId: info.messageId });
    });
  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};



exports.getTemplates = async (req, res) => {
  const templates = await Template.find();
  res.json(templates);
};

exports.addTemplate = async (req, res) => {
  try {
    console.log('Received add template request:', req.body);
    console.log('Files received:', req.files);

    const { subject, body } = req.body;

    // Validate input
    if (!subject || !body) {
      return res.status(400).json({ message: 'Subject and body are required' });
    }

    // Prepare attachments array
    let attachments = [];
    if (req.files && req.files.length > 0) {
      attachments = req.files.map(file => ({
        filename: file.filename,
        originalName: file.originalname,
        path: file.path,
        mimetype: file.mimetype,
        size: file.size
      }));
    }

    const template = await Template.create({
      subject,
      body,
      attachments
    });

    res.json(template);
  } catch (error) {
    console.error('Error creating template:', error);
    res.status(500).json({ message: 'Error creating template', error: error.message });
  }
};

exports.getMailStatus = async (req, res) => {
  try {
    const mails = await Mail.find().sort({ createdAt: -1 });
    res.json(mails);
  } catch (error) {
    console.error('Error fetching mail status:', error);
    res.status(500).json({ message: 'Error fetching mail status', error: error.message });
  }
};



