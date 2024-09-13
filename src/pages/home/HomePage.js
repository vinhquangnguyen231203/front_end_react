import React, { useEffect, useState } from 'react'
import Header from '../../components/header/Header'
import { Button, Input, Table } from 'reactstrap'
import { useDispatch, useSelector } from 'react-redux'
import { searchStudent } from '../../redux/studentSlice'

export default function HomePage() {
  const [searchText, setSearchText] = useState('')
  const { status, students, message } = useSelector((state) => state.student)
  const dispatch = useDispatch()
  const handel_changeText = (e) => {
    setSearchText(e.target.value)
  }
  // console.log(searchStudents)

  const handle_saveSearch = () => {
    dispatch(searchStudent(searchText))
  }
  // useEffect(() => {

  // }, [searchStudents])
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


  return (
    <div>
      <Header />
      Home page

      <div>
        <Input type="text" placeholder='nhập.....' value={searchText} onChange={handel_changeText} />
        <Button className="btn btn-success"
          onClick={handle_saveSearch}
        >Search </Button>


        <Table striped>
          <thead>
            <tr>
              <th>
                #
              </th>
              {/* <th>
                #
              </th> */}
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
        
            </tr>
          </thead>
          <tbody>

            {
              students && students.map((item, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  {/* <td>

                    {item.id}


                  </td> */}
                  <td scope="row">


                    {item.name}

                    {/* {item.name} */}
                  </td>
                  <td>

                    {item.thanhPho}

                  </td>
                  <td >
                     {item.ngaySinh}
                  </td>
                  <td>
                    {/* {item.xepLoai} */}

                    {convertXepLoai(item.xepLoai)}
                  </td>


                </tr>
              ))
            }

          </tbody>
        </Table>
      </div>


    </div>
  )
}
