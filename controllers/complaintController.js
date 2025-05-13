const complaintModel = require('../models/complaintSchema');
const orderModel = require('../models/orderSchema');
const productModel = require('../models/productSchema');
const userModel = require('../models/userSchema');

// Submit a complaint
exports.submitComplaint = async (req, res) => {
  try {
    const { description, product, order } = req.body;

    const complaint = new complaintModel();
    complaint.submitComplaint(description, product, order);

    await complaint.save();
    res.status(201).json({ message: 'Complaint submitted successfully', complaint });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error submitting complaint', error });
  }
};

// Get the status of a complaint
exports.getComplaintStatus = async (req, res) => {
  try {
    const complaint = await complaintModel.findById(req.params.complaintId);
    if (!complaint) {
      return res.status(404).json({ message: 'Complaint not found.' });
    }
    res.status(200).json({ status: complaint.getComplaintStatus() });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error retrieving complaint status', error });
  }
};

// Update the status of a complaint
exports.updateComplaintStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const complaint = await complaintModel.findById(req.params.complaintId);
    if (!complaint) {
      return res.status(404).json({ message: 'Complaint not found.' });
    }

    complaint.updateStatus(status);
    await complaint.save();
    res.status(200).json({ message: 'Complaint status updated successfully', complaint });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error updating complaint status', error });
  }
};

// Get complaint details
exports.getComplaintDetails = async (req, res) => {
  try {
    const complaint = await complaintModel.findById(req.params.complaintId);
    if (!complaint) {
      return res.status(404).json({ message: 'Complaint not found.' });
    }
    res.status(200).json({ details: complaint.getComplaintDetails() });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error retrieving complaint details', error });
  }
};

// Resolve a complaint
exports.resolveComplaint = async (req, res) => {
  try {
    const complaint = await complaintModel.findById(req.params.complaintId);
    if (!complaint) {
      return res.status(404).json({ message: 'Complaint not found.' });
    }

    complaint.resolveComplaint();
    await complaint.save();
    res.status(200).json({ message: 'Complaint resolved successfully', complaint });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error resolving complaint', error });
  }
};

// Archive a complaint
exports.archiveComplaint = async (req, res) => {
  try {
    const complaint = await complaintModel.findById(req.params.complaintId);
    if (!complaint) {
      return res.status(404).json({ message: 'Complaint not found.' });
    }

    complaint.archiveComplaint();
    await complaint.save();
    res.status(200).json({ message: 'Complaint archived successfully', complaint });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error archiving complaint', error });
  }
};

// Delete a complaint
exports.deleteComplaint = async (req, res) => {
  try {
    const complaint = await complaintModel.findById(req.params.complaintId);
    if (!complaint) {
      return res.status(404).json({ message: 'Complaint not found.' });
    }

    await complaint.deleteComplaint();
    res.status(200).json({ message: 'Complaint deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error deleting complaint', error });
  }
};
