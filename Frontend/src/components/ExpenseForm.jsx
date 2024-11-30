import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { addExpense } from "../api/api";
import {
  TextField,
  RadioGroup,
  FormControlLabel,
  Radio,
  Button,
  Box,
  Typography,
  Grid,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

const ExpenseForm = () => {
  const navigate = useNavigate();

  const initialValues = {
    amount: "",
    description: "",
    date: "",
    category: "",
    paymentMethod: "cash",
  };

  const validationSchema = Yup.object({
    amount: Yup.number().required("Amount is required").positive(),
    description: Yup.string().required("Description is required"),
    date: Yup.date().required("Date is required"),
    category: Yup.string().required("Category is required"),
  });

  const onSubmit = async (values, { resetForm }) => {
    try {
      await addExpense(values);

      resetForm();

      navigate("/");
    } catch (error) {
      console.error("Error adding expense:", error);
    }
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={onSubmit}
    >
      {({ setFieldValue, touched, errors, values }) => (
        <Form>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 2,
              maxWidth: 500,
              margin: "auto",
              padding: 3,
              boxShadow: 3,
              borderRadius: 2,
              backgroundColor: "#fff",
            }}
          >
            <Typography variant="h4" gutterBottom>
              Add Expense
            </Typography>

            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Field
                  name="amount"
                  type="number"
                  as={TextField}
                  label="Amount"
                  variant="outlined"
                  fullWidth
                  error={touched.amount && !!errors.amount}
                  helperText={touched.amount && errors.amount}
                />
              </Grid>

              <Grid item xs={12}>
                <Field
                  name="description"
                  as={TextField}
                  label="Description"
                  variant="outlined"
                  fullWidth
                  error={touched.description && !!errors.description}
                  helperText={touched.description && errors.description}
                />
              </Grid>

              <Grid item xs={12}>
                <Field
                  name="date"
                  as={TextField}
                  label="Date"
                  type="date"
                  variant="outlined"
                  fullWidth
                  InputLabelProps={{
                    shrink: true,
                  }}
                  error={touched.date && !!errors.date}
                  helperText={touched.date && errors.date}
                />
              </Grid>

              <Grid item xs={12}>
                <Field
                  name="category"
                  as={TextField}
                  label="Category"
                  variant="outlined"
                  fullWidth
                  error={touched.category && !!errors.category}
                  helperText={touched.category && errors.category}
                />
              </Grid>

              <Grid item xs={12}>
                <Typography variant="subtitle1">Payment Method</Typography>
                <RadioGroup
                  row
                  name="paymentMethod"
                  value={values.paymentMethod}
                  onChange={(e) =>
                    setFieldValue("paymentMethod", e.target.value)
                  }
                >
                  <FormControlLabel
                    value="cash"
                    control={<Radio />}
                    label="Cash"
                  />
                  <FormControlLabel
                    value="credit"
                    control={<Radio />}
                    label="Credit"
                  />
                </RadioGroup>
              </Grid>
            </Grid>

            <Button type="submit" variant="contained" color="primary" fullWidth>
              Add Expense
            </Button>
          </Box>
        </Form>
      )}
    </Formik>
  );
};

export default ExpenseForm;
