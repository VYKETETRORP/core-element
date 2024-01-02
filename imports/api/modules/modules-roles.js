import Mongoose from 'mongoose'
// const SchemaTypes = Mongoose.Schema.Types

const Schema = new Mongoose.Schema({
  // _id: String,
  moduleRoles: [String],
})
export default Mongoose.model('app_moduleRoles', Schema, 'app_moduleRoles')