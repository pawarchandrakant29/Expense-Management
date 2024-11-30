import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  TextField,
  Button,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Pagination as MuiPagination,
} from "@mui/material";
import ExpenseCharts from "./Charts";
import { Routes, Route, useNavigate } from "react-router-dom";

const ExpenseList = ({ onEditExpense, onDeleteExpense }) => {
  const [expenses, setExpenses] = useState([]);
  const [filteredExpenses, setFilteredExpenses] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchDescription, setSearchDescription] = useState("");
  const [searchCategory, setSearchCategory] = useState("");
  const [category, setCategory] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [editingExpenseId, setEditingExpenseId] = useState(null);
  const [updatedExpense, setUpdatedExpense] = useState({});
  const [openDialog, setOpenDialog] = useState(false);

  const itemsPerPage = 5;

  const fetchExpenses = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/expenses");
      setExpenses(response.data);
    } catch (error) {
      console.error("Error fetching expenses:", error);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const applyFilters = () => {
    let filtered = [...expenses];
    if (searchDescription) {
      filtered = filtered.filter((expense) =>
        expense.description
          .toLowerCase()
          .includes(searchDescription.toLowerCase())
      );
    }
    if (searchCategory) {
      filtered = filtered.filter((expense) =>
        expense.category.toLowerCase().includes(searchCategory.toLowerCase())
      );
    }
    if (category) {
      filtered = filtered.filter((expense) => expense.category === category);
    }
    if (paymentMethod) {
      filtered = filtered.filter(
        (expense) => expense.paymentMethod === paymentMethod
      );
    }
    if (startDate && endDate) {
      filtered = filtered.filter((expense) => {
        const expenseDate = new Date(expense.date);
        return (
          expenseDate >= new Date(startDate) && expenseDate <= new Date(endDate)
        );
      });
    }
    setFilteredExpenses(filtered);
  };

  const navigate = useNavigate();

  const pagechange = (path) => {
    navigate(path);
  };

  const handleDeleteExpense = async (expenseId) => {
    try {
      await axios.delete(`http://localhost:5000/api/expenses/${expenseId}`);
      setExpenses(expenses.filter((expense) => expense._id !== expenseId));
    } catch (error) {
      console.error("Error deleting expense:", error);
    }
  };

  const handleEditExpense = (expense) => {
    setEditingExpenseId(expense._id);
    setUpdatedExpense({ ...expense });
    setOpenDialog(true);
  };

  const handleSaveExpense = async () => {
    try {
      const formattedDate = new Date(updatedExpense.date)
        .toISOString()
        .split("T")[0];
      const response = await axios.put(
        `http://localhost:5000/api/expenses/${editingExpenseId}`,
        { ...updatedExpense, date: formattedDate }
      );
      setExpenses(
        expenses.map((expense) =>
          expense._id === editingExpenseId ? response.data : expense
        )
      );
      setOpenDialog(false);

      setTimeout(() => {
        window.location.reload();
      }, 500);
    } catch (error) {
      console.error("Error updating expense:", error);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [
    searchDescription,
    searchCategory,
    category,
    paymentMethod,
    startDate,
    endDate,
    expenses,
  ]);

  const totalItems = filteredExpenses.length;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedExpenses = filteredExpenses.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  return (
    <>
      <div>
        <div style={{ marginBottom: "20px" }}>
          <TextField
            label="Search by description"
            variant="outlined"
            fullWidth
            value={searchDescription}
            onChange={(e) => setSearchDescription(e.target.value)}
            style={{ marginBottom: "10px", marginRight: "10px" }}
          />

          <TextField
            label="Category"
            variant="outlined"
            fullWidth
            value={searchCategory}
            onChange={(e) => setSearchCategory(e.target.value)}
            style={{
              marginBottom: "10px",
              marginRight: "10px",
              width: "150px",
            }}
          />
          <FormControl
            variant="outlined"
            style={{
              marginBottom: "10px",
              marginRight: "10px",
              width: "150px",
            }}
          >
            <InputLabel>Payment Method</InputLabel>
            <Select
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
              label="Payment Method"
            >
              <MenuItem value="">Select Payment Method</MenuItem>
              <MenuItem value="cash">Cash</MenuItem>
              <MenuItem value="credit">Credit</MenuItem>
            </Select>
          </FormControl>
          <TextField
            type="date"
            label="Start Date"
            variant="outlined"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            style={{ marginBottom: "10px", marginRight: "10px" }}
            InputLabelProps={{
              shrink: true,
            }}
          />
          <TextField
            type="date"
            label="End Date"
            variant="outlined"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            style={{ marginBottom: "10px" }}
            InputLabelProps={{
              shrink: true,
            }}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={applyFilters}
            style={{ marginTop: "20px" }}
          >
            Apply Filters
          </Button>
        </div>

        <Button
          variant="contained"
          color="primary"
          onClick={() => pagechange("/add-expense")}
          className="btn-set"
        >
          Add Expenses
        </Button>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Amount</TableCell>
                <TableCell>Description</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Category</TableCell>
                <TableCell>Payment Method</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedExpenses.map((expense) => (
                <TableRow key={expense._id}>
                  <TableCell>
                    {editingExpenseId === expense._id ? (
                      <TextField
                        type="number"
                        value={updatedExpense.amount}
                        onChange={(e) =>
                          setUpdatedExpense({
                            ...updatedExpense,
                            amount: e.target.value,
                          })
                        }
                        variant="outlined"
                        size="small"
                      />
                    ) : (
                      expense.amount
                    )}
                  </TableCell>
                  <TableCell>
                    {editingExpenseId === expense._id ? (
                      <TextField
                        type="text"
                        value={updatedExpense.description}
                        onChange={(e) =>
                          setUpdatedExpense({
                            ...updatedExpense,
                            description: e.target.value,
                          })
                        }
                        variant="outlined"
                        size="small"
                      />
                    ) : (
                      expense.description
                    )}
                  </TableCell>
                  <TableCell>
                    {editingExpenseId === expense._id ? (
                      <TextField
                        type="date"
                        value={updatedExpense.date}
                        onChange={(e) =>
                          setUpdatedExpense({
                            ...updatedExpense,
                            date: e.target.value,
                          })
                        }
                        variant="outlined"
                        size="small"
                      />
                    ) : (
                      formatDate(expense.date)
                    )}
                  </TableCell>
                  <TableCell>
                    {editingExpenseId === expense._id ? (
                      <TextField
                        type="text"
                        value={updatedExpense.category}
                        onChange={(e) =>
                          setUpdatedExpense({
                            ...updatedExpense,
                            category: e.target.value,
                          })
                        }
                        variant="outlined"
                        size="small"
                      />
                    ) : (
                      expense.category
                    )}
                  </TableCell>
                  <TableCell>
                    {editingExpenseId === expense._id ? (
                      <TextField
                        type="text"
                        value={updatedExpense.paymentMethod}
                        onChange={(e) =>
                          setUpdatedExpense({
                            ...updatedExpense,
                            paymentMethod: e.target.value,
                          })
                        }
                        variant="outlined"
                        size="small"
                      />
                    ) : (
                      expense.paymentMethod
                    )}
                  </TableCell>
                  <TableCell>
                    {editingExpenseId === expense._id ? (
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={handleSaveExpense}
                        style={{ marginRight: "10px" }}
                      >
                        Save
                      </Button>
                    ) : (
                      <>
                        <Button
                          variant="contained"
                          color="primary"
                          onClick={() => handleEditExpense(expense)}
                          style={{ marginRight: "10px" }}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="contained"
                          color="secondary"
                          onClick={() => handleDeleteExpense(expense._id)}
                        >
                          Delete
                        </Button>
                      </>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <MuiPagination
          count={Math.ceil(totalItems / itemsPerPage)}
          page={currentPage}
          onChange={(e, page) => setCurrentPage(page)}
          color="primary"
          style={{ marginTop: "20px" }}
        />

        <ExpenseCharts expenses={filteredExpenses} />
      </div>
    </>
  );
};

export default ExpenseList;
