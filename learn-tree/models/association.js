import UserManagement from "./userManagement";
import Child from "./child";
import Class from "./classManagement";
import ClassTerm from "./classTerm";

const defineAssociations = () => {

    // UserManagement -> Child (One-to-Many)
    UserManagement.hasMany(Child, {
        foreignKey: 'parentId',
        as: 'children', // Alias for relation
        onDelete: 'CASCADE', // Optional: Cascade delete children if parent is deleted
    });
    Child.belongsTo(UserManagement, {
        foreignKey: 'parentId',
        as: 'parent',
    });

    // Class -> ClassTerm (One-to-Many)
    Class.hasMany(ClassTerm, {
        foreignKey: 'classId',
        as: 'children', // Alias for relation
        onDelete: 'CASCADE', // Optional: Cascade delete children if parent is deleted
    });
    ClassTerm.belongsTo(Class, {
        foreignKey: 'classId',
        as: 'parent',
    });


}

module.exports = defineAssociations;