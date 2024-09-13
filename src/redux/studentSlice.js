import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

import axios from 'axios';
import StudentPage from '../pages/student/StudentPage';

const BASE_URL = 'http://localhost:8080/api/v1';

export const getAlll=createAsyncThunk("student/getAll",async ({currentPage,limit},thunkAPI)=>{
    const url =BASE_URL+`/student/list?page=${currentPage}&size=${limit}`;
    try{
        const response=await axios.get(url);
        return response.data;
    }
    catch (error){
        return thunkAPI.rejectWithValue(error.response.data); // Trả về lỗi nếu có
    }
});


export const deleteStudent = createAsyncThunk('students/deleteStudent',async (id, thunkAPI) => {
        const url = BASE_URL+`/student/${id}`
        try{
            const response = await axios.delete(url);
            return response.data; 
        }
        catch (error){
            return thunkAPI.rejectWithValue(error.response.data); // Trả về lỗi nếu có
        }
    }
);


export const addNewStudent = createAsyncThunk('student/addNewStudent', async(student, thunkAPI)=>{
    const url =BASE_URL+ '/student';
    try{
        const response = await axios.post(url, student)
        return response.data
    }
    catch (error){
        return thunkAPI.rejectWithValue(error.response.data)
    }
})

export const updateStudent = createAsyncThunk('student/updateStudent', async({id, student}, thunkAPI)=>{
    const url = BASE_URL + `/student/${id}`
    try{
        const response = await axios.put(url,student)
        return response.data
    }
    catch (error){
        return thunkAPI.rejectWithValue(error.response.data)
    }
})

export const searchStudent=createAsyncThunk("student/searchStudent",async (searchText,thunkAPI)=>{
    const url =BASE_URL+`/student/search3?name=${searchText}`;
   
    try{
        const response=await axios.get(url);
        if (searchText === ''){
            thunkAPI.dispatch(getAlll({
                currentPage:0,
                limit:5
            }))
            return []
        } else{
            return response.data

        }
    }
    catch (error){
        return thunkAPI.rejectWithValue(error.response.data); // Trả về lỗi nếu có
    }
});
export const searchStudentByXepLoai=createAsyncThunk("student/searchStudentByXepLoai",async (searchXepLoai,thunkAPI)=>{
    const url =BASE_URL+`/student/searchXepLoai?xepLoai=${searchXepLoai}`;
   
    try{
        const response=await axios.get(url);
        if (searchXepLoai === ''){
            thunkAPI.dispatch(getAlll({
                currentPage:0,
                limit:5
            }))
            return []
        } else{
            return response.data

        }
    }
    catch (error){
        return thunkAPI.rejectWithValue(error.response.data); // Trả về lỗi nếu có
    }
});
export const search=createAsyncThunk("student/search",async ({name, xepLoai, thanhPho, startYear, endYear},thunkAPI)=>{
const url =BASE_URL+`/student/search?name=${name}&xepLoai=${xepLoai}&thanhPho=${thanhPho}&startYear=${startYear}&endYear=${endYear}`;
    try{
        const response=await axios.get(url);
        if (name === ''){
            thunkAPI.dispatch(getAlll({
                currentPage:0,
                limit:5
            }))
            return []
        } else{
            return response.data

        }
    }
    catch (error){
        return thunkAPI.rejectWithValue(error.response.data); // Trả về lỗi nếu có
    }
});


const studentSlice=createSlice({
    name:"student",
    initialState:{
        students:[],
        searchStudents:[],
        totalPages:10,
        status: "idle",
        message: "",
        error: null
    },
    reducers:{
        resetStatusAndMessage: (state) =>{
            state.status =null;
            state.error = null;
            state.message = "";
        }
      

    },
    extraReducers:(builder)=>{
        builder
        .addCase(getAlll.fulfilled,(state,action)=>{
            state.students=action.payload.data.students
            state.totalPages=action.payload.data.totalPages
        })
        .addCase(addNewStudent.fulfilled,(state, action)=>{
            state.students =[...state.students, action.payload.data]
            state.message = action.payload.message
            state.status = action.payload.status
        })
        .addCase(addNewStudent.rejected,(state, action)=>{
            state.message = action.payload.message
            state.error = action.payload.data
            state.status =action.payload.status
        })
        .addCase(deleteStudent.fulfilled, (state, action) => {
            state.students = state.students.filter(student => student.id !== action.payload);
            state.status =action.payload.status
            state.message = action.payload.message
        })
        .addCase(deleteStudent.rejected, (state, action) => {
            state.error = state.students.data
            state.status =action.payload.status
            state.message = action.payload.message
        })
        .addCase(updateStudent.fulfilled, (state, action) => {
            state.students = state.students.map(student => student.id === action.payload.data.id ? action.payload.data : student );
            state.status =action.payload.status
            state.message = action.payload.message
        })
        .addCase(updateStudent.rejected, (state, action) => {
            state.error = state.students.data
            state.status =action.payload.status
            state.message = action.payload.message
        })
        .addCase(searchStudent.fulfilled,(state,action)=>{
            state.students = action.payload.data
            state.status =action.payload.status
        })
        .addCase(searchStudent.rejected,(state,action)=>{
            state.error = action.payload.data
            state.status =action.payload.status
            state.message = action.payload.message
        })
        .addCase(searchStudentByXepLoai.fulfilled,(state,action)=>{
            state.students = action.payload.data
            state.status =action.payload.status
        })
        .addCase(searchStudentByXepLoai.rejected,(state,action)=>{
            state.error = action.payload.data
            state.status =action.payload.status
            state.message = action.payload.message
        })
        .addCase(search.fulfilled,(state,action)=>{
            state.students = action.payload.data
            state.status =action.payload.status
        })
        .addCase(search.rejected,(state,action)=>{
            state.error = action.payload.data
            state.status =action.payload.status
            state.message = action.payload.message
        })
    }
    }
)
export const {resetStatusAndMessage} = studentSlice.actions
export default studentSlice.reducer

