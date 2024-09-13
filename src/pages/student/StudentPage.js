import React, { useEffect, useState } from 'react'
import Header from '../../components/header/Header'
import Student from '../../components/student/Student'
import { Alert, Button, FormGroup, Input, Label, Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import { useDispatch, useSelector } from 'react-redux';
import { addNewStudent, getAlll, resetStatusAndMessage } from '../../redux/studentSlice';
import { toast } from 'react-toastify';

export default function StudentPage() {
  const [modal, setModal ] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const limit = 5;
  const {status, message, error}=useSelector((state)=>state.student)
  // dispatch(getAlll({ currentPage, limit })
  const [student, setStudent] = useState(
    {
      name: " dfgdf ",
      ngaySinh: "12-10-2023",
      thanhPho: "thu 2",
      xepLoai: "Giỏi"
  })
  const dispatch = useDispatch();
  const toggle = ()=> {
    setModal(!modal)
    // if (modal){
    //   dispatch(resetStatusAndMessage)
    // }
  }
  useEffect(()=>{
    if (status){
      if (status === 200){
        console.log(status)
        toast.success(message)
        setModal(false)
         //tắt modal
        //  dispatch(resetStatusAndMessage())
      }
      else {
        toast.error(message)
      }
    }
  }, [status, message])
 
  const handleAdd= ()=>{
    // toggle();
    // console.log(student)
    dispatch(addNewStudent(student)).then(()=>{
      dispatch(getAlll({ currentPage, limit }))
    })
    // window.location.reload()

  }

  const handleChange = (e)=>{
    const {name, value} = e.target;

    if (name === "ngaySinh"){
      setStudent(preStudent =>({
        ...preStudent,
        [name]:convertDateToDDMMYYYY(value)
        // [name]:value
      }))
    }
    else{
      setStudent(preStudent=>({
        ...preStudent,
        [name]:value
      }))
    }
    
  }

  const convertDateToDDMMYYYY = (date)=>{
    const [year, month, day] = date.split('-')
    return `${day}-${month}-${year}`
  }
  const convertDateToYYYYMMDD = (date)=>{
    const [day, month, year] = date.split('-')
    return `${year}-${month}-${day}`
  }
  return (
    <div>
      <Header />
      <Button onClick={toggle} className='btn btn-success'>Add new student</Button>
      <h1>Student page</h1>
      <Student
       convertDateToDDMMYYYY={convertDateToDDMMYYYY}
       convertDateToYYYYMMDD={convertDateToYYYYMMDD}/>
      <Modal isOpen={modal} toggle={toggle}>
        {
          error && (
                  <Alert color='danger'>
                    <ul>
                      {
                        error.map((error, index)=>(
                          <li key={index}>
                            {error}
                          </li>
                        ))
                      }
                    </ul>
                  </Alert>
          )
        }
        <ModalHeader toggle={toggle}>Add new student</ModalHeader>
        <ModalBody>
          <FormGroup>
            <Label for='input'>Họ Tên</Label>
            <Input id='input'
                   name='name'
                   placeholder='Họ Tên'
                   type='text'
                   value={student.name}
                   onChange={handleChange}
            />
          </FormGroup>
          <FormGroup>
          <Label for='input'>Thành Phố</Label>
            <Input id='input'
                   name='thanhPho'
                   placeholder='Thành Phố'
                   type='text'
                   value={student.thanhPho}
                   onChange={handleChange}
            />
          </FormGroup>
          <FormGroup>
          <Label for='input'>Xếp loại</Label>
            <Input id='input'
                   name='xepLoai'
                  //  placeholder='Thành Phố'
                   type='select'
                   value={student.xepLoai}
                   onChange={handleChange}
            >
              <option>
                Giỏi
              </option>
              <option>
                Khá
              </option>
              <option>
                Trung bình
              </option>
              <option>
                Yếu
              </option>
            </Input>
          </FormGroup>
          <FormGroup>
          <Label for='input'>Ngày sinh</Label>
            <Input id='input'
                   name='ngaySinh'
                   placeholder='Ngày Sinh'
                   type='date'
                   value= {convertDateToYYYYMMDD(student.ngaySinh)}
                  // value= {(student.ngaySinh)}
                   onChange={handleChange}
            />
          </FormGroup>
        </ModalBody>
        <ModalFooter>
          <Button color='primary' onClick={handleAdd}>
            Save
          </Button>
          <Button color='danger' onClick={toggle}>Cancel</Button>
        </ModalFooter>
      
      </Modal>

    </div>
  )
}
