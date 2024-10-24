import { useState, useEffect } from "react";
import service from "../services/config.js";
import CardUser from "./CardUser.jsx";
import { useNavigate } from "react-router-dom";
import Pagination from "./Pagination.jsx";
function ListUser(props) {
  const navigate = useNavigate();
  const [allUsers, setAllUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = props.usersPerPage || 12;

  const { searchValue } = props;

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    try {
      const response = await service.get("/user/");

      setAllUsers(response.data);
    } catch (error) {
      console.log(error);
      navigate("/error");
    }
  };

  const searchedUsers = allUsers.filter((eachUser) => {
    return eachUser.username.toLowerCase().includes(searchValue.toLowerCase());
  });

  const totalPages = Math.ceil(searchedUsers.length / usersPerPage);

  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = searchedUsers.slice(indexOfFirstUser, indexOfLastUser);

  const onPageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div>
      <div className="user-list">
        {currentUsers.map((eachUser) => {
          return <CardUser key={eachUser._id} {...eachUser} />;
        })}
      </div>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={onPageChange}
        nextLabel=">"
        prevLabel="<"
        className="custom-pagination"
      />
    </div>
  );
}

export default ListUser;
