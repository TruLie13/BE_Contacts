const asyncHandler = require("express-async-handler");
const Contact = require("../models/contactModel.js");
const { isValidObjectId } = require("mongoose");

const checkIsIdValidObject = (req, res) => {
  if (!isValidObjectId(req.params.id)) {
    res.status(400).json({ error: "Invalid contact ID format" });
    return;
  }
};

const contactController = {
  //@desc Get all contacts
  //@route Get api/contacts
  //@access private
  getContacts: asyncHandler(async (req, res) => {
    const contacts = await Contact.find({ user_id: req.user.id });
    res.status(200).json(contacts);
  }),

  //@desc Create new contacts
  //@route POST api/contacts
  //@access private
  createContact: asyncHandler(async (req, res) => {
    console.log("The req body is:", req.body);
    const { name, email, phone } = req.body;
    if (!name || !email || !phone) {
      res.status(400);
      throw new Error("All fields mandatory");
    }
    const contact = await Contact.create({
      name,
      email,
      phone,
      user_id: req.user.id,
    });
    res.status(200).json(contact);
  }),

  //@desc Get contacts
  //@route GET api/contacts/:id
  //@access private
  getContact: asyncHandler(async (req, res) => {
    checkIsIdValidObject(req, res);
    const contact = await Contact.findById(req.params.id);
    if (!contact || contact === null) {
      res.status(404);
      throw new Error("Contact not found");
    }
    res.status(200).json(contact);
  }),

  //@desc Update contact
  //@route PUT api/contacts/:id
  //@access private
  updateContact: asyncHandler(async (req, res) => {
    checkIsIdValidObject(req, res);
    const contact = await Contact.findById(req.params.id);
    if (!contact) {
      res.status(404);
      throw new Error("Contact not found");
    }
    if (contact.user_id.toString() !== req.user.id) {
      res.status(403);
      throw new Error("User cannot update other user's contacts");
    }
    const updatedContact = await Contact.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.status(200).json(updatedContact);
  }),

  //@desc Delete contact
  //@route Delete api/contacts/:id
  //@access private
  deleteContact: asyncHandler(async (req, res) => {
    checkIsIdValidObject(req, res);
    const contact = await Contact.findById(req.params.id);
    if (!contact) {
      res.status(404);
      throw new Error("Contact not found");
    }
    if (contact.user_id.toString() !== req.user.id) {
      res.status(403);
      throw new Error("User cannot delete other user's contacts");
    }
    await Contact.findByIdAndDelete(req.params.id);
    res.status(200).json(contact);
  }),
};
module.exports = contactController;
