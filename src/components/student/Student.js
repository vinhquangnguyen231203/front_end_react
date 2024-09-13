import React, { useEffect, useState } from 'react'
import { Alert, Button, Container, Input, Table } from 'reactstrap'

import { useDispatch, useSelector } from 'react-redux';
import { deleteStudent, getAlll, resetStatusAndMessage, search, searchStudent, searchStudentByXepLoai, updateStudent } from '../../redux/studentSlice';
import ReactPaginate from 'react-paginate';
export default function Student(props) {

    const { convertDateToDDMMYYYY, convertDateToYYYYMMDD } = props

    const [currentPage, setCurrentPage] = useState(0)
    const [showMessage, setShowMessage] = useState(false)
    const { totalPages, students, status, message, error } = useSelector((state) => state.student)
    const limit = 5
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(getAlll({ currentPage, limit }))
    }, [currentPage, dispatch])

    useEffect(() => {
        if (status && message) {
            setShowMessage(true)

            const timer = setTimeout(() => {
                setShowMessage(false)
                dispatch(resetStatusAndMessage())
            }, 2000)
            return () => clearTimeout(timer)
        }
    }, [status, message, dispatch])

    const handlePageClick = (event) => {
        setCurrentPage(event.selected)
    }
    const handle_delete = (id) => {
        dispatch(deleteStudent(id)).then(() => {
            dispatch(getAlll({ currentPage, limit }))
        })
        // window.location.reload()
    };


    const [EStudent, setEStudent] = useState({ id: "", name: "", thanhPho: "", ngaySinh: "", xepLoai: "" })
    const [studentEdit, setStudentEdit] = useState({ isEdit: false, id: "" })
    const handle_edit = (id, item) => {
        setStudentEdit({ isEdit: true, id })
        setEStudent(item)

    }
    const handle_save = (id) => {

        dispatch(updateStudent({
            id,
            student:
            {
                ...EStudent,

                ngaySinh: convertDateToYYYYMMDD(EStudent.ngaySinh),
                // ngaySinh: (EStudent.ngaySinh)                // Sử dụng định dạng YYYY-MM-DD
                xepLoai: convertXepLoai(EStudent.xepLoai) // Sử dụng giá trị phù hợp với enum
            }

        }));
        setStudentEdit({ isEdit: false, id: "" })

    }

    const [searchTemp, setSearchTemp] = useState('')
    const filterStudent = students && students.filter((student) =>
        student.name.toLowerCase().includes(searchTemp.toLowerCase())
    )

    const [searchTextAPI, setSearchTextAPI] = useState('')
    const handle_searchAPI = () => {
        dispatch(searchStudent(searchTextAPI))
    }
    const XepLoaiEnum = {
        GIOI: "Giỏi",
        KHA: "Khá",
        TRUNG_BINH: "Trung bình",
        YEU: "Yếu"
    };

    const convertXepLoai = (enumCode) => {
        switch (enumCode) {
            case "GIOI":
                return XepLoaiEnum.GIOI;
            case "KHA":
                return XepLoaiEnum.KHA;
            case "TRUNG_BINH":
                return XepLoaiEnum.TRUNG_BINH;
            case "YEU":
                return XepLoaiEnum.YEU;
            default:
                return enumCode;
        }
    };

    const [searchXepLoai, setSearchXepLoai] = useState('')
    const handle_searchXepLoai = () => {
        dispatch(searchStudentByXepLoai(searchXepLoai))
    }


    // const [searchXepLoaiAll, setSearchXepLoaiAll] = useState('')
    // const [searchTextAll, setSearchAll] = useState('')
    const [searchStudentAll, setSearchStudentAll] =useState({"name":"", "xepLoai":"Giỏi", "thanhPho":"", "startYear":"2000", "endYear":"2024"})
    useEffect(()=>{
        dispatch(search(searchStudentAll))
    },[searchStudentAll])
    return (
        <Container>
            <h1>Total: {totalPages}</h1>

            <Container className='classInput '>
                <Input type="text" placeholder='nhập.....' value={searchTemp} onChange={(e) => setSearchTemp(e.target.value)} />

                <Input type="text" placeholder='nhập.....' value={searchTextAPI} onChange={(e) => setSearchTextAPI(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key == "Enter") {
                            handle_searchAPI()
                        }
                    }} />
                <div className='dis_div'>
                    <Input type="select" placeholder='nhập.....' value={searchXepLoai} onChange={(e) => setSearchXepLoai(e.target.value)}>
                    <option>
                            Khá
                        </option>
                        <option>
                            Giỏi
                        </option>
                        
                        <option>
                            Trung bình
                        </option>
                        <option>
                            Yếu
                        </option>
                        <option>
                            
                        </option>
                    </Input>
                    <Button className="btn btn-success"
                        onClick={handle_searchXepLoai}
                    >Search </Button>

                </div>

                <Container className='groupInput pt-3 pb-3'>
                    <Input type="text" placeholder='nhập.....' value={searchStudentAll.name} onChange={(e) => setSearchStudentAll({...searchStudentAll, "name": e.target.value})}
                         />

                    <Input type="select" value={searchStudentAll.xepLoai} onChange={(e) => setSearchStudentAll({...searchStudentAll, "xepLoai": convertXepLoai(e.target.value)})}>

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
                       =
                    </Input>
                    <Input className='mt-3' type="number" value={searchStudentAll.startYear} onChange={(e) => setSearchStudentAll({...searchStudentAll, "startYear": e.target.value})}/>
                    <Input type="number" value={searchStudentAll.endYear} onChange={(e) => setSearchStudentAll({...searchStudentAll, "endYear": e.target.value})}/>
                   
                </Container>
            </Container>
            {
                showMessage && (
                    <Alert color={status === 200 ? "success" : "danger"}>
                        {message}
                    </Alert>)
            }
            <Table striped>
                <thead>
                    <tr>
                        <th>
                            #
                        </th>
                        <th>
                            #
                        </th>
                        <th>
                            Tên sinh viên
                        </th>
                        <th>
                            Thành phố
                        </th>
                        <th>
                            Ngày sinh
                        </th>
                        <th>
                            Xếp loại
                        </th>
                        <th>
                            Delete
                        </th>
                    </tr>
                </thead>
                <tbody>

                    {
                        filterStudent && filterStudent.map((item, index) => (
                            <tr key={index} className={studentEdit.isEdit && item.id === studentEdit.id ? "student-item active" : "student-item"}>
                                <td>{index + 1}</td>
                                <td>
                                    {studentEdit.isEdit && item.id === studentEdit.id ?
                                        <Input type="hidden" value={EStudent.id}
                                            onChange={(e) => setEStudent({ ...EStudent, id: e.target.value })}
                                        />
                                        :
                                        item.id
                                    }

                                </td>
                                <td scope="row">

                                    {studentEdit.isEdit && item.id === studentEdit.id ?
                                        <Input type="text" value={EStudent.name}
                                            onChange={(e) => setEStudent({ ...EStudent, name: e.target.value })}
                                        />
                                        :
                                        item.name
                                    }
                                    {/* {item.name} */}
                                </td>
                                <td>
                                    {studentEdit.isEdit && item.id === studentEdit.id ?
                                        <Input type="text" value={EStudent.thanhPho}
                                            onChange={(e) => setEStudent({ ...EStudent, thanhPho: e.target.value })}
                                        />
                                        :
                                        item.thanhPho
                                    }
                                </td>
                                <td >

                                    {studentEdit.isEdit && item.id === studentEdit.id ?
                                        <Input type="date" value={EStudent.ngaySinh}

                                            onChange={(e) => setEStudent({ ...EStudent, ngaySinh: e.target.value })}
                                        />
                                        :
                                        convertDateToDDMMYYYY(item.ngaySinh)
                                        // (item.ngaySinh)
                                    }
                                </td>
                                <td>
                                    {studentEdit.isEdit && item.id === studentEdit.id ?
                                        <Input type="select" value={EStudent.xepLoai}
                                            onChange={(e) => setEStudent({ ...EStudent, xepLoai: e.target.value })}
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
                                        :
                                        convertXepLoai(item.xepLoai)
                                    }
                                    {/* {item.xepLoai} */}
                                </td>

                                <td>

                                    {
                                        studentEdit.isEdit && item.id === studentEdit.id ?
                                            <Button className="btn btn-success"
                                                onClick={() => handle_save(item.id)}
                                            >Save </Button>
                                            :
                                            <>
                                                <Button
                                                    className="btn btn-danger"
                                                    onClick={() => {
                                                        if (window.confirm("Bạn có muốn xóa sinh viên này hay không?")) {
                                                            handle_delete(item.id);
                                                        }
                                                    }}
                                                >
                                                    <i className="fa-solid fa-delete-left"></i>
                                                </Button>
                                                <Button className="btn btn-success"
                                                    onClick={() =>
                                                        handle_edit(item.id, item)
                                                    }
                                                >
                                                    <i class="fa-solid fa-pen-to-square"></i>
                                                </Button>
                                            </>
                                    }
                                </td>

                            </tr>
                        ))
                    }

                </tbody>
            </Table>
            <ReactPaginate
                previousLabel={'Previous'}
                nextLabel={'Next'}
                breakLabel={'...'}
                pageCount={Math.ceil(totalPages)}
                marginPagesDisplayed={2}
                pageRangeDisplayed={5}
                onPageChange={handlePageClick}
                containerClassName={'pagination'}
                pageClassName={'page-item'}
                pageLinkClassName={'page-link'}
                previousClassName={'page-item'}
                nextClassName={'page-item'}
                previousLinkClassName={'page-link'}
                nextLinkClassName={'page-link'}
                breakClassName={'page-item'}
                breakLinkClassName={'page-link'}
                activeClassName={'active'}
            />
        </Container >
    )
}
