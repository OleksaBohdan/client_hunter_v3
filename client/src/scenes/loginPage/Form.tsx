import { useState } from 'react';
import { Box, Button, TextField, useMediaQuery, Typography, useTheme } from '@mui/material';

import { Formik } from 'formik';
import * as yup from 'yup';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setLogin } from '../../state';

const registerSchema = yup.object().shape({
  email: yup.string().email('email is not valid').required('required'),
  password: yup.string().required('required').min(8),
});

const loginSchema = yup.object().shape({
  email: yup.string().email('email is not valid').required('required'),
  password: yup.string().required('required'),
});

const initialValuesRegister = {
  email: '',
  password: '',
};

const initialValuesLogin = {
  email: '',
  password: '',
};

const Form = () => {
  const [pageType, setPageType] = useState('register');
  const { palette } = useTheme();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isNonMobile = useMediaQuery('(min-width:760px)');
  const isLogin = pageType === 'login';
  const isRegister = pageType === 'register';

  const register = async (values: any, onSubmitProps: any) => {
    const savedUserResponse = await fetch('http://localhost:3001/api/v1/auth/register', {
      method: 'POST',
      body: JSON.stringify(values),
    });
    const savedUser = await savedUserResponse.json();
    onSubmitProps.resetForm();

    if (savedUser) {
      setPageType('login');
    }
  };

  const login = async (values: any, onSubmitProps: any) => {
    const loggedInResponse = await fetch('http://localhost:3001/api/v1/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(values),
    });
    const loggedIn = await loggedInResponse.json();
    onSubmitProps.resetForm();
    if (loggedIn) {
      dispatch(
        setLogin({
          user: loggedIn.user,
          token: loggedIn.token,
        })
      );
      navigate('/home');
    }
  };

  const handleFormSubmit = async (values: any, onSubmitProps: any) => {
    console.log(values, onSubmitProps);
    if (isLogin) await login(values, onSubmitProps);
    if (isRegister) await register(values, onSubmitProps);
  };

  const statusStyle = (status: any) => {
    switch (status) {
      case 'login':
        return palette.primary.main;
      case 'register':
        return palette.primary.light;
    }
  };

  return (
    <Formik
      onSubmit={handleFormSubmit}
      initialValues={isLogin ? initialValuesLogin : initialValuesRegister}
      validationSchema={isLogin ? loginSchema : registerSchema}
    >
      {({ values, errors, touched, handleBlur, handleChange, handleSubmit, setFieldValue, resetForm }) => (
        <form onSubmit={handleSubmit}>
          <Typography fontWeight="500" variant="h5" sx={{ mb: '1.5rem' }}>
            {isLogin ? 'Welcome back' : 'Create your account'}
          </Typography>
          <Box
            sx={{
              display: 'grid',
              gap: '20px',
              gridTemplateColumns: 'repeat(4, minmax(0, 1fr))',
              // gridTemplateColumns: 'repeat(4, minmax(0, 1fr))',
            }}
          >
            {isRegister && (
              <>
                <TextField
                  label="Email"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.email}
                  name="email"
                  error={Boolean(touched.email) && Boolean(errors.email)}
                  helperText={touched.email && errors.email}
                  sx={{ gridColumn: 'span 4' }}
                />
                <TextField
                  label="Password"
                  type="password"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.password}
                  name="password"
                  error={Boolean(touched.password) && Boolean(errors.password)}
                  helperText={touched.password && errors.password}
                  sx={{ gridColumn: 'span 4' }}
                />
              </>
            )}

            {isLogin && (
              <>
                <TextField
                  label="Email"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.email}
                  name="email"
                  error={Boolean(touched.email) && Boolean(errors.email)}
                  helperText={touched.email && errors.email}
                  sx={{ gridColumn: 'span 4' }}
                />
                <TextField
                  label="Password"
                  type="password"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.password}
                  name="password"
                  error={Boolean(touched.password) && Boolean(errors.password)}
                  helperText={touched.password && errors.password}
                  sx={{ gridColumn: 'span 4' }}
                />
              </>
            )}
          </Box>

          <Box>
            <Button
              fullWidth
              type="submit"
              sx={{
                m: '2rem 0',
                p: '1rem',
                backgroundColor: statusStyle(pageType),
                color: palette.background.paper,
                '&:hover': { backgroundColor: statusStyle(pageType) },
                fontWeight: '900',
              }}
            >
              {isLogin ? 'SIGN IN' : 'REGISTER'}
            </Button>
            <Typography
              onClick={() => {
                setPageType(isLogin ? 'register' : 'login');
                resetForm();
              }}
              sx={{
                '&:hover': {
                  cursor: 'pointer',
                },
              }}
            >
              {isLogin ? "Don't have an account? Sign Up here." : 'Already have an account? Login here.'}
            </Typography>
          </Box>
        </form>
      )}
    </Formik>
  );
};

export default Form;
