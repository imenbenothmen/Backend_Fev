const mongoose = require('mongoose');

const complaintSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  order: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: true },
  description: { type: String, required: true },
  status: {
    type: String,
    enum: ['In Progress', 'Resolved', 'Archived'],
    default: 'In Progress',
  }
}, { timestamps: true });

// Complaint management methods
complaintSchema.methods.submitComplaint = function (description, product, order) {
  this.description = description;
  this.product = product;
  this.order = order;
  this.status = 'In Progress';
};

complaintSchema.methods.getComplaintStatus = function () {
  return this.status;
};

complaintSchema.methods.updateStatus = function (status) {
  if (['In Progress', 'Resolved', 'Archived'].includes(status)) {
    this.status = status;
  }
};

complaintSchema.methods.getComplaintDetails = function () {
  return this.description;
};

complaintSchema.methods.resolveComplaint = function () {
  this.status = 'Resolved';
};

complaintSchema.methods.archiveComplaint = function () {
  this.status = 'Archived';
};

complaintSchema.methods.deleteComplaint = async function () {
  await this.remove();
};

const Complaint = mongoose.model('Complaint', complaintSchema);
module.exports = Complaint;
