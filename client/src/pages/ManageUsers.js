import React, { useEffect, useState } from 'react';
import Footer from '../components/Footer';
import Header from '../components/Header';
import { message } from 'antd';
import axios from 'axios';
import host from '../APIRoute/host';
import { useSelector } from 'react-redux';
import Confirmation from '../components/Confirmation';
import Loader from '../components/Loader';
import '../styles/SharingPage.css'
const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');
  const [filteredUser, setFilteredUser] = useState([]);
  const [loading,setLoading]=useState(true);
  const [isConfirm,setIsConfirm]=useState(false)
  const [currentUserId, setCurrentUserId] = useState(null);
  const [actionType, setActionType] = useState(''); // New state for action type
  const {user}=useSelector((state)=>state.user)

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${host}/user/getAllUsers`, {
        headers: {
          authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (res.data.success) {
        console.log(res.data)
        setUsers(res.data.users);
        setFilteredUser(res.data.users);
      }
    } catch (error) {
      console.error(error.message);
      message.error('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
   

    fetchUsers();
  }, []);

  const filterUsers = () => {
    const lowerCaseSearch = search.toLowerCase();
    const filtered = users.filter(
      (item) =>
        (item.name?.toLowerCase() || '').includes(lowerCaseSearch) ||
        (item.email?.toLowerCase() || '').includes(lowerCaseSearch)
    );
    setFilteredUser(filtered);
    console.log(filtered)
  };

  useEffect(() => {
   

    filterUsers();
  }, [search, users]);

  const handleChangeAdmin = async (id) => {
    try {
      const res = await axios.put(`${host}/user/changeAdmin/${id}`, {}, {
        headers: {
          authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (res.data.success) {
        message.success('Changed successfully');
        setUsers((prevUsers) =>
          prevUsers.map((user) =>
            user._id === id ? { ...user, isAdmin: !user.isAdmin } : user
          )
        );
      }
    } catch (error) {
      message.error('Something went wrong');
      console.error(error.message);
    }
    setIsConfirm(false);
  };

  const handleDelete = async (id) => {
    try {
      const res = await axios.delete(`${host}/user/deleteUser/${id}`, {
        headers: {
          authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (res.data.success) {
        message.success('User deleted successfully');
        setUsers((prevUsers) => prevUsers.filter((user) => user._id !== id));
        setFilteredUser((prevFilteredUsers) =>
          prevFilteredUsers.filter((user) => user._id !== id)
        );
      }
    } catch (error) {
      message.error('Something went wrong');
      console.error(error.message);
    }
    setIsConfirm(false);
  };

  const confirmAction = () => {
    if (actionType === 'changeAdmin') {
      handleChangeAdmin(currentUserId);
    } else if (actionType === 'delete') {
      handleDelete(currentUserId);
    }
  };


  return (
    <>
      <Header/>
      <Confirmation
        onConfirm={confirmAction}
        isConfirm={isConfirm}
        setIsConfirm={setIsConfirm}
      />     
       <div className='main-container container mx-auto px-4 py-8' style={{width:'100%'}} >
        <h1 className='text-3xl font-bold text-center mb-6'>
          <span className='text-primary'>Manage Users</span>
        </h1>
        {loading ? <Loader/>  :
        <div className='cont shared-post'  >
             {/* Search Component */}
             <div className="mb-3 xl:w-96">
            <div className="relative mb-4 flex w-full flex-wrap items-stretch">
                <input
                    type="search"
                    className="relative m-0 block flex-auto rounded border border-solid border-neutral-300 bg-transparent bg-clip-padding px-3 py-[0.25rem] text-base font-normal leading-[1.6] text-neutral-700 outline-none transition duration-200 ease-in-out focus:z-[3] focus:border-primary focus:text-neutral-700 focus:shadow-[inset_0_0_0_1px_rgb(59,113,202)] focus:outline-none dark:border-neutral-600 dark:text-neutral-200 dark:placeholder:text-neutral-200 dark:focus:border-primary"
                    placeholder="Search"
                    aria-label="Search"
                    name='search'
                    value={search}
                    onChange={(e)=>setSearch(e.target.value)}
                    aria-describedby="button-addon2" />

                {/* <!--Search icon--> */}
                {/* <span
                    className="input-group-text flex items-center whitespace-nowrap rounded px-3 py-1.5 text-center text-base font-normal text-neutral-700 dark:text-neutral-200"
                    id="basic-addon2">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        className="h-5 w-5">
                        <path
                            fillRule="evenodd"
                            d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z"
                            clipRule="evenodd" />
                    </svg>
                </span> */}
            </div>
        </div>

        {/* Table component */}
        <div className="flex flex-col table-container">
  <div className="overflow-x-auto sm:-mx-6 lg:-mx-8">
    <div className="inline-block min-w-full py-2 sm:px-6 lg:px-8">
      <div className="overflow-hidden">
        <table className="min-w-full text-left text-sm font-light">
          <thead className="border-b font-medium dark:border-neutral-500">
            <tr>
              
              <th scope="col" className="px-6 py-4">Name</th>
              <th scope="col" className="px-6 py-4">Email</th>
              <th scope="col" className="px-6 py-4">Mobile</th>
              <th scope="col" className="px-6 py-4">Change Admin</th>
              <th scope="col" className="px-6 py-4">Delete</th>
            </tr>
          </thead>
          <tbody>
            {filteredUser?.map((item) => (
              
                item?._id!==user?._id &&              
              <tr
                key={item?._id} // Make sure to add a unique key if `item.id` exists
                className="border-b transition duration-300 ease-in-out hover:bg-neutral-100 dark:border-neutral-500 dark:hover:bg-neutral-600"
              >
                
                <td className="whitespace-nowrap px-6 py-4 font-medium">{item?.name}</td>
                <td className="whitespace-nowrap px-6 py-4">{item?.email}</td>
                <td className="whitespace-nowrap px-6 py-4">{item?.phone}</td>
                <td className="whitespace-nowrap px-6 py-4">  <button
                              type="button"
                              style={{ fontSize: '0.7rem' }}
                              onClick={() => {
                                setCurrentUserId(item._id);
                                setActionType('changeAdmin');
                                setIsConfirm(true);
                              }}                              className="add-btn inline-block rounded bg-primary px-6 pb-2 pt-2.5 text-xs font-medium uppercase leading-normal text-white shadow-[0_4px_9px_-4px_#3b71ca] transition duration-150 ease-in-out hover:bg-primary-600 hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:bg-primary-600 focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:outline-none focus:ring-0 active:bg-primary-700 active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] dark:shadow-[0_4px_9px_-4px_rgba(59,113,202,0.5)] dark:hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] dark:focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] dark:active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)]"
                            >
                              {item.isAdmin ? 'Remove Admin' : 'Make Admin'}</button></td> {/* Ensure casing matches */}
                <td className="whitespace-nowrap px-6 py-4"> <button type="button" style={{fontSize:'0.7rem'}}
                onClick={() => {
                  setCurrentUserId(item._id);
                  setActionType('delete');
                  setIsConfirm(true);
                }}
      className="add-btn inline-block rounded bg-primary px-6 pb-2 pt-2.5 text-xs font-medium uppercase leading-normal text-white shadow-[0_4px_9px_-4px_#3b71ca] transition duration-150 ease-in-out hover:bg-primary-600 hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:bg-primary-600 focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:outline-none focus:ring-0 active:bg-primary-700 active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] dark:shadow-[0_4px_9px_-4px_rgba(59,113,202,0.5)] dark:hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] dark:focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] dark:active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)]"
    >Delete</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  </div>
</div>

        </div>
        }   
        </div>
      <Footer/>
    </>
  )
}

export default ManageUsers
