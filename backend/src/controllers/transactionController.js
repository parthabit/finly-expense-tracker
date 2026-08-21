const asyncHandler = require("../utils/asyncHandler");
const ApiError = require("../utils/ApiError");
const Transaction = require("../models/Transaction");
const cloudinary = require("../config/cloudinary");
const streamifier = require("streamifier");

const uploadReceiptToCloudinary = (buffer) =>
  new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: "expense-tracker/receipts" },
      (err, result) => (err ? reject(err) : resolve(result))
    );
    streamifier.createReadStream(buffer).pipe(stream);
  });

const createTransaction = asyncHandler(async (req, res) => {
  const payload = { ...req.body, user: req.user._id };

  if (req.file) {
    const result = await uploadReceiptToCloudinary(req.file.buffer);
    payload.receiptUrl = result.secure_url;
    payload.receiptPublicId = result.public_id;
  }

  const transaction = await Transaction.create(payload);
  res.status(201).json({ success: true, transaction });
});

const listTransactions = asyncHandler(async (req, res) => {
  const {
    page = 1,
    limit = 10,
    search,
    category,
    type,
    paymentMethod,
    startDate,
    endDate,
    sortBy = "date",
    sortOrder = "desc",
  } = req.query;

  const query = { user: req.user._id };
  if (category) query.category = category;
  if (type) query.type = type;
  if (paymentMethod) query.paymentMethod = paymentMethod;
  if (startDate || endDate) {
    query.date = {};
    if (startDate) query.date.$gte = new Date(startDate);
    if (endDate) query.date.$lte = new Date(endDate);
  }
  if (search) {
    query.$or = [
      { description: { $regex: search, $options: "i" } },
      { notes: { $regex: search, $options: "i" } },
      { tags: { $regex: search, $options: "i" } },
    ];
    const asNumber = Number(search);
    if (!Number.isNaN(asNumber)) query.$or.push({ amount: asNumber });
  }

  const sortDir = sortOrder === "asc" ? 1 : -1;
  const sort = { [sortBy]: sortDir };

  const pageNum = Math.max(1, parseInt(page, 10));
  const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10)));

  const [transactions, total] = await Promise.all([
    Transaction.find(query)
      .sort(sort)
      .skip((pageNum - 1) * limitNum)
      .limit(limitNum),
    Transaction.countDocuments(query),
  ]);

  res.json({
    success: true,
    transactions,
    pagination: {
      page: pageNum,
      limit: limitNum,
      total,
      totalPages: Math.ceil(total / limitNum) || 1,
    },
  });
});

const getTransaction = asyncHandler(async (req, res) => {
  const transaction = await Transaction.findOne({ _id: req.params.id, user: req.user._id });
  if (!transaction) throw new ApiError(404, "Transaction not found");
  res.json({ success: true, transaction });
});

const updateTransaction = asyncHandler(async (req, res) => {
  const transaction = await Transaction.findOne({ _id: req.params.id, user: req.user._id });
  if (!transaction) throw new ApiError(404, "Transaction not found");

  if (req.file) {
    const result = await uploadReceiptToCloudinary(req.file.buffer);
    req.body.receiptUrl = result.secure_url;
    req.body.receiptPublicId = result.public_id;
  }

  Object.assign(transaction, req.body);
  await transaction.save();
  res.json({ success: true, transaction });
});

const deleteTransaction = asyncHandler(async (req, res) => {
  const transaction = await Transaction.findOneAndDelete({ _id: req.params.id, user: req.user._id });
  if (!transaction) throw new ApiError(404, "Transaction not found");
  if (transaction.receiptPublicId) {
    await cloudinary.uploader.destroy(transaction.receiptPublicId).catch(() => {});
  }
  res.json({ success: true, message: "Transaction deleted" });
});

module.exports = {
  createTransaction,
  listTransactions,
  getTransaction,
  updateTransaction,
  deleteTransaction,
};
