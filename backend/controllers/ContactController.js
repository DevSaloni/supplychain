const Contact = require("../models/ContactModel");

//create and save a new contact 

const createContact = async(req,res) =>{
    try{
      const {firstName,lastName,email,mobNo,subject,message} = req.body;

      //check all filed required
      if(!firstName || !lastName || !email || !subject || !message){
        res.status(400).send({message:"All filed required"});
      }
      
      //create contact
      const contact = new Contact({
        firstName,
        lastName,
        email,
        mobNo,
        subject,
        message
      });
      await contact.save();
      res.status(201).send({message:"Contact created successfully"});

    }catch(err){
        res.status(500).send({message:err.message });
    }
}

module.exports={createContact};