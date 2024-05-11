import React, { useEffect, useRef, useState } from 'react'
import { v4 as uuid } from 'uuid'

const DataTable = () => {
    const[formData,setFormData]= useState({name:"", gender:"", age:""});
    const[data,setData]= useState([]);
    const [editId, setEditId] = useState(false);
    const [searchTerm,setSearchTerm]= useState("");
    const[currentPage, setCurrentPage]= useState(1);

    const outsideClick = useRef(false);

    const itemsPerPage = 5;
    const LastItem = currentPage*itemsPerPage;
    const indexofFirstItem = LastItem - itemsPerPage;

    let filteredItems = data.filter(item =>item.name.toLowerCase().includes(searchTerm.toLowerCase()))

    const filteredData = filteredItems.slice(indexofFirstItem,LastItem)

    useEffect(() => {
        setCurrentPage(1);
    },[searchTerm])

    useEffect(() => {
        if(!editId) return;

        let selectedItem = document.querySelectorAll(`[id='${editId}']`);
        selectedItem[0].focus();
    },[editId])

    const handleChange =(e) => {
        setFormData({...formData, [e.target.name]:e.target.value})
        
    }

    useEffect(()=> {

        const handleClickOutside = e => {
            if(outsideClick.current && !outsideClick.current.contains(e.target)){
                setEditId(false)
            }
        }
        document.addEventListener("click", handleClickOutside);

        return()=> {
            document.removeEventListener("click", handleClickOutside)
        }

    },[])

   const handleAddClick = () => {
    if(formData.name && formData.gender && formData.age){
        const newItem={
            id:uuid(),
            name:formData.name,
            gender:formData.gender,
            age:formData.age
        }
        setData([...data, newItem]);
        setFormData({name:"", gender:"", age:""})
    }
   }

  

   const handleDelete = id => {
    if(filteredData.length === 1 && currentPage !== 1) {
        setCurrentPage(prev => prev -1)
    }
    const updatedList = data.filter(item => item.id !== id);
    setData(updatedList)
   }

   const handleEdit =(id, updatedData) => {
    if(!editId || editId !== id){
        return;
    }

    const updatedList = data.map((item) => item.id === id ? {...item,...updatedData}: item);
    setData(updatedList)
   }

   const handleSearch = (e) => {
    setSearchTerm(e.target.value)
   };

   const paginate = (pageNumber) => {
    setCurrentPage(pageNumber)
   }

  return (
    <div className="container">
        <div className='add-container'>
            <div className='info-container'>
                <input type="text" placeholder='Name' name="name" value={formData.name} onChange={handleChange}/>
                <input type="text" placeholder='Gender' name="gender" value={formData.gender} onChange={handleChange}/>
                <input type="text" placeholder='Age' name="age" value={formData.age} onChange={handleChange}/>
            </div>
            <button className='add' onClick={handleAddClick}>Add</button>
        </div>

        <div className='search-table-container'>
            <input type="text" placeholder='Search by name' value={searchTerm} onChange={handleSearch} className='search-input' />
        </div>

        <table ref={outsideClick}>
            <thead>
                <tr>
                    <th>Name</th>
                    <th>Gender</th>
                    <th>Age</th>
                    <th>Action</th>
                </tr>
            </thead>
            <tbody>
                {filteredData.map(item => (
                    <tr key={item.id}>
                    <td id={item.id} contentEditable={editId === item.id} onBlur={e => handleEdit(item.id, {name:e.target.innerText})}>{item.name}</td>
                    <td id={item.id} contentEditable={editId === item.id} onBlur={e => handleEdit(item.id, {name:e.target.innerText})}> {item.gender}</td>
                    <td id={item.id} contentEditable={editId === item.id} onBlur={e => handleEdit(item.id, {name:e.target.innerText})}>{item.age}</td>
                   <td className='actions'>
                    <button className='edit'onClick={()=> setEditId(item.id)}>Edit</button>
                    <button className='delete' onClick={() =>handleDelete(item.id)}>Delete</button>
                   </td>
                </tr>
                ))}
            </tbody>
        </table>
        <div className='pagination'>
            {Array.from({length: Math.ceil(filteredItems.length/itemsPerPage)},(_, index)=>(
                <button  className="button" key={index+1} onClick={()=> paginate(index+1)} 
                style={{backgroundColor:currentPage === index+1 && "lightgreen"}}>
                    {index +1}
                </button>
            ))}
        </div>
    </div>
  )
}

export default DataTable