const { name } = require("ejs");
const fs = require("fs");

//buat folder data
const dirPath = "./data";
if (!fs.existsSync(dirPath)) {
  fs.mkdirSync(dirPath);
}

//buat contact.json
const dataPath = "./data/contacts.json";
if (!fs.existsSync(dataPath)) {
  fs.writeFileSync(dataPath, "[]", "utf-8");
}

//mengambil semua data contact.json
const saveContact = () => {
  const file = fs.readFileSync("data/contacts.json", "utf8");
  const contacts = JSON.parse(file);
  return contacts;
};

//mencari kontak berdasarkan nama
const findContact = (name) => {
  const contacts = saveContact();
  const contact = contacts.find((contact) => contact.name === name);
  return contact;
};

//menuliskan file contacts.json dengan data baru
const saveCont = (contacts) => {
  fs.writeFileSync("data/contacts.json", JSON.stringify(contacts));
};

// menambahkan data contact baru
const addCont = (contact) => {
  const contacts = saveContact();
  contacts.push(contact);
  saveCont(contacts);
};

//cek nama yang duplikat
const cekDuplikat = (name) => {
  const contacts = saveContact();
  return contacts.find((contact) => contact.name === name);
};

//menghapus contact
const deleteContact = (name) => {
  const contacts = saveContact();
  const filteredContacts = contacts.filter((contact) => contact.name !== name);
  saveCont(filteredContacts);
};

//mengubah contact
const updateContact = (newcont) => {
  const contacts = saveContact();
 //menghilangkan contact lama
 const filteredContacts = contacts.filter((contact) => contact.name !== newcont.oldName) 
 delete newcont.oldName;
 filteredContacts.push(newcont);
 saveCont(filteredContacts);

}

module.exports = { saveContact, findContact, addCont, cekDuplikat, deleteContact , updateContact};
