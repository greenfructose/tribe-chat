import { useState } from 'react';
import styled from 'styled-components';
import {
  Button,
  FormControl,
  Input,
  InputLabel,

} from '@material-ui/core';
import InputAdornment from "@material-ui/core/InputAdornment";
import ErrorIcon from "@material-ui/icons/Error";
import VisibilityTwoToneIcon from "@material-ui/icons/VisibilityTwoTone";
import VisibilityOffTwoToneIcon from "@material-ui/icons/VisibilityOffTwoTone";
import CloseIcon from "@material-ui/icons/Close";
import {
  registerWithEmailAndPassword,
} from "../firebase";

const RegistrationForm = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [hidePassword, setHidePassword] = useState(true);
  const [password, setPassword] = useState('');
  const [passwordConfirm, setConfirmPassword] = useState('');
  const [showRegistrationForm, setShowRegistrationForm] = useState(false);
  return (
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
                htmlFor="name"
              >
                Username
              </InputLabel>
              <Input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Username"
              />
            </FormControl>
            <FormControl>
              <InputLabel
                htmlFor="email"
              >
                Email
              </InputLabel>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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
              onClick={() => registerWithEmailAndPassword(
                name,
                email,
                password
              )}>
              Register
            </Button>
          </Form>
        </ModalBody>
      </ModalContainer>
    </ModalOverlay>
  )
}

export default RegistrationForm

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