const fs = require("fs/promises");
const shortid = require("shortid");
const path = require("path");

const readContacts = async () => {
  const contacts = await fs.readFile(
    path.join(__dirname, "./contacts.json"),
    "utf8"
  );
  return JSON.parse(contacts);
};

const writeContacts = async (contacts) => {
  await fs.writeFile(
    path.join(__dirname, "contacts.json"),
    JSON.stringify(contacts)
  );
};

const listContacts = async () => {
  return await readContacts();
};

const getContactById = async (contactId) => {
  const contacts = await readContacts();
  return contacts.find(({ id }) => id === contactId);
};

const removeContact = async (contactId) => {
  const contacts = await readContacts();
  const contactIdx = contacts.findIndex(({ id }) => id === contactId);

  if (contactIdx !== -1) {
    const removedContact = contacts.splice(contactIdx, 1);
    writeContacts(contacts);
    return removedContact;
  }

  return null;
};

const addContact = async (body) => {
  const record = { id: shortid.generate(), ...body };

  const contacts = await readContacts();
  contacts.push(record);
  writeContacts(contacts);

  return record;
};

const updateContact = async (contactId, body) => {
  const contacts = await readContacts();

  const newContacts = contacts.map((contact) =>
    contact.id === contactId ? { ...contact, ...body } : contact
  );

  writeContacts(newContacts);

  const updatedContact = newContacts.find(({ id }) => id === contactId);
  return updatedContact;
};

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
};
