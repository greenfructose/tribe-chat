import { useEffect, useState, useContext } from "react";
import Head from 'next/head';
import styled from 'styled-components';
import {
  Button,
  FormControl,
  Input,
  InputLabel,
} from '@material-ui/core';
import InputAdornment from "@material-ui/core/InputAdornment";
import VisibilityTwoToneIcon from "@material-ui/icons/VisibilityTwoTone";
import VisibilityOffTwoToneIcon from "@material-ui/icons/VisibilityOffTwoTone";
import CloseIcon from "@material-ui/icons/Close";

import { Context } from '../context';


function Login() {
  const {
    username,
    setUsername,
    password,
    setPassword,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signInWithPopup,
    googleProvider,
    auth
  } = useContext(Context);
  const [hidePassword, setHidePassword] = useState(true);
  const [passwordConfirm, setConfirmPassword] = useState('');
  const [showLoginForm, setShowLoginForm] = useState(false);
  const [showRegistrationForm, setShowRegistrationForm] = useState(false);


  return (
    <Container>
      <Head>
        <title>Login</title>
      </Head>
      <LoginContainer>
        <Logo
          src='favicon.ico'
        />
        <Button
          onClick={() => signInWithPopup(auth, googleProvider)}
          variant='outlined'
        >
          Sign in with Google
        </Button>
        <Button
          onClick={() => setShowLoginForm(true)}
          variant='outlined'
        >
          Sign in with Email and Password
        </Button>
      </LoginContainer>
      <RegisterContainer>
        <h2>Not Registered?</h2>
        <Button
          onClick={() => setShowRegistrationForm(true)}
          variant='outlined'
        >
          Register with Email and Password
        </Button>
        <Button
          onClick={() => signInWithPopup(auth, googleProvider)}
          variant='outlined'
        >
          Register with Google
        </Button>
      </RegisterContainer>
      {showRegistrationForm === true &&
        <ModalOverlay>
          <ModalContainer>
            <ModalHeader>
              <a href="#" onClick={() => setShowRegistrationForm(false)}>
                <CloseIcon />
              </a>
            </ModalHeader>
            <h2>Register</h2>
            <ModalBody>
              <Form>
                <FormControl>
                  <InputLabel
                    htmlFor="email"
                  >
                    Email
                  </InputLabel>
                  <Input
                    type="email"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="E-mail Address"
                  />
                </FormControl>
                <FormControl>
                  <InputLabel
                    htmlFor="password"
                  >
                    Password
                  </InputLabel>
                  <Input
                    required
                    type={hidePassword ? 'password' : 'input'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                    endAdornment={
                      hidePassword ? (
                        <InputAdornment position="end">
                          <VisibilityOffTwoToneIcon
                            fontSize="default"
                            onClick={() => setHidePassword(false)}
                          />
                        </InputAdornment>
                      ) : (
                        <InputAdornment position="end">
                          <VisibilityTwoToneIcon
                            fontSize="default"
                            onClick={() => setHidePassword(true)}
                          />
                        </InputAdornment>
                      )
                    }
                  />
                </FormControl>
                <FormControl>
                  <InputLabel
                    htmlFor="passwordConfirm"
                  >
                    Confirm Password
                  </InputLabel>
                  <Input
                    required
                    type={hidePassword ? 'password' : 'input'}
                    value={passwordConfirm}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm Password"
                    endAdornment={
                      hidePassword ? (
                        <InputAdornment position="end">
                          <VisibilityOffTwoToneIcon
                            fontSize="default"
                            onClick={() => setHidePassword(false)}
                          />
                        </InputAdornment>
                      ) : (
                        <InputAdornment position="end">
                          <VisibilityTwoToneIcon
                            fontSize="default"
                            onClick={() => setHidePassword(true)}
                          />
                        </InputAdornment>
                      )
                    }
                  />
                </FormControl>

                <Button
                  onClick={() => createUserWithEmailAndPassword(
                    auth,
                    username,
                    password
                  )}>
                  Register
                </Button>
              </Form>
            </ModalBody>
          </ModalContainer>
        </ModalOverlay>
      }
      {showLoginForm === true &&
        <ModalOverlay>
          <ModalContainer>
            <ModalHeader>
              <a href="#" onClick={() => setShowLoginForm(false)}>
                <CloseIcon />
              </a>
            </ModalHeader>
            <h2>Login</h2>
            <ModalBody>
              <Form>
                <FormControl>
                  <InputLabel
                    htmlFor="email"
                  >
                    Email
                  </InputLabel>
                  <Input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="E-mail Address"
                  />
                </FormControl>
                <FormControl>
                  <InputLabel
                    htmlFor="password"
                  >
                    Password
                  </InputLabel>
                  <Input
                    type={hidePassword ? 'password' : 'input'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                    endAdornment={
                      hidePassword ? (
                        <InputAdornment position="end">
                          <VisibilityOffTwoToneIcon
                            fontSize="default"
                            onClick={() => setHidePassword(false)}
                          />
                        </InputAdornment>
                      ) : (
                        <InputAdornment position="end">
                          <VisibilityTwoToneIcon
                            fontSize="default"
                            onClick={() => setHidePassword(true)}
                          />
                        </InputAdornment>
                      )
                    }
                  />
                </FormControl>
                <Button
                  onClick={() => signInWithEmailAndPassword(
                    auth,
                    username, 
                    password
                  )}
                >
                  Log In
                </Button>
              </Form>
            </ModalBody>
          </ModalContainer>
        </ModalOverlay>
      }
    </Container>
  )
}

export default Login

const Container = styled.div`
  display: grid;
  place-items: center;
  height: 100vh;
  background-color: whitesmoke;
`;
const LoginContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding: 100px;
  align-items: center;
  background-color: white;
  border-radius: 5px;
  box-shadow: 0px 4px 14px -3px rgba(0, 0, 0, 0.7);
`;
const RegisterContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding: 10px;
  align-items: center;
  background-color: white;
  border-radius: 5px;
  box-shadow: 0px 4px 14px -3px rgba(0, 0, 0, 0.7);
`;
const Logo = styled.img`
  height: 200px;
  width: 200px;
  margin-bottom: 50px;
`;


const ModalBody = styled.div`
  padding-top: 10px;
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: flex-end;
  font-size: 25px;
`;

const ModalContainer = styled.div`
  background: white;
  width: 500px;
  height: 600px;
  border-radius: 2px;
  padding: 15px;
`;
const ModalOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.5);
`;
const Form = styled.form`
  display: flex;
  align-items: flex-start;
  justify-content: flex-start;
  flex-direction: column;
`;