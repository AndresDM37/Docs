import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

const UserTypeSelector = ({
  userType,
  setUserType,
  onClickHandler,
}: UserTypeSelectorParams) => {
  const accesChangeHandler = (type: UserType) => {
    setUserType(type);
    if (onClickHandler) {
      onClickHandler(type);
    }
  };

  return (
    <Select
      value={userType}
      onValueChange={(type: UserType) => accesChangeHandler(type)}
    >
      <SelectTrigger className="shad-select">
        <SelectValue placeholder="Theme">{userType}</SelectValue>
      </SelectTrigger>
      <SelectContent className="border-none bg-dark-200">
        <SelectItem value="viewer" className="shad-select-item">
          Ver
        </SelectItem>
        <SelectItem value="editor" className="shad-select-item">
          Editar
        </SelectItem>
      </SelectContent>
    </Select>
  );
};

export default UserTypeSelector;
