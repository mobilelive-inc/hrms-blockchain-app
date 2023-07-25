import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { Button, Form, Header, Modal } from 'semantic-ui-react';
import Admin from '../abis/Admin.json';
import { updateUserApi } from '../Apis/UsersApi';
import './Modals.css';

const GetEditFieldModal = ({ isOpen, tokenId, closeEditFieldModal }) => {
  const [formData, setFormData] = useState({
    firstname1: '',
    lastname1: '',
    city1: '',
    country1: '',
    email1: '',
    current_position1: '',
    loading: false,
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    const {
      firstname1,
      lastname1,
      city1,
      country1,
      email1,
      current_position1,
    } = formData;

    if (
      !firstname1 &&
      !lastname1 &&
      !city1 &&
      !country1 &&
      !email1 &&
      !current_position1
    ) {
      toast.error('Please enter a field.');
      return;
    }

    setFormData({ ...formData, loading: true });

    const web3 = window.web3;
    const networkId = await web3.eth.net.getId();
    const AdminData = await Admin.networks[networkId];
    console.log('adminData: ', AdminData);
    const accounts = await web3.eth.getAccounts();
    const messageToR = `0x${Buffer.from(
      'Please confirm to verify info update',
      'utf8'
    ).toString('hex')}`;
    const signature = await web3.eth.personal.sign(messageToR, accounts[0]);
    console.log('field: ', signature);

    const dataToSend = {
      tokenId: tokenId,
      signature: signature,
    };

    if (firstname1) {
      dataToSend.first_name = firstname1;
    }
    if (lastname1) {
      dataToSend.last_name = lastname1;
    }

    if (city1) {
      dataToSend.city = city1;
    }
    if (country1) {
      dataToSend.country = country1;
    }
    if (email1) {
      dataToSend.email = email1;
    }

    if (current_position1) {
      dataToSend.current_position = current_position1;
    }

    await updateUserApi(accounts[0], dataToSend)
      .then((response) => {
        const transaction = response?.data?.response?.transactionData;
        transaction.from = accounts[0];

        const receipt = web3.eth
          .sendTransaction(transaction)
          .then((res) => {
            return new Promise((resolve) => setTimeout(resolve, 7000));
          })
          .then(() => {
            setFormData({ ...formData, loading: false });
            closeEditFieldModal();
          });

        console.log('receipt > ', receipt);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleChange = (e) => {
    e.preventDefault();
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  return (
    <Modal
      as={Form}
      onSubmit={handleSubmit}
      open={isOpen}
      size="tiny"
      className="modal-des"
    >
      <Header
        className="modal-heading"
        icon="pencil"
        content="Update Fields"
        as="h2"
      />
      <Modal.Content className="modal-content">
          <>
            {' '}
            <Form.Field className="form-inputs">
              <input
                id="firstname1"
                placeholder="First Name"
                autoComplete="off"
                autoCorrect="off"
                value={formData.firstname1}
                onChange={handleChange}
              />
            </Form.Field>
            <Form.Field className="form-inputs">
              <input
                id="lastname1"
                placeholder="Last Name"
                autoComplete="off"
                autoCorrect="off"
                value={formData.lastname1}
                onChange={handleChange}
              />
            </Form.Field>
            <Form.Field className="form-inputs">
              <input
                id="city1"
                placeholder="City"
                autoComplete="off"
                autoCorrect="off"
                value={formData.city1}
                onChange={handleChange}
              />
            </Form.Field>{' '}
            <Form.Field className="form-inputs">
              <input
                id="country1"
                placeholder="Country"
                autoComplete="off"
                autoCorrect="off"
                value={formData.country1}
                onChange={handleChange}
              />
            </Form.Field>{' '}
            <Form.Field className="form-inputs">
              <input
                id="email1"
                placeholder="Email"
                autoComplete="off"
                autoCorrect="off"
                value={formData.email1}
                onChange={handleChange}
              />
            </Form.Field>{' '}
            <Form.Field className="form-inputs">
              <input
                id="current_position1"
                placeholder="Current Position"
                autoComplete="off"
                autoCorrect="off"
                value={formData.current_position1}
                onChange={handleChange}
              />
            </Form.Field>{' '}
          </>
      </Modal.Content>
      <Modal.Actions className="modal-actions">
        <Button
          className="close-button"
          type="button"
          color="red"
          icon="times"
          content="Close"
          onClick={closeEditFieldModal}
        />
        <Button
          className="button-css"
          type="submit"
          color="green"
          icon="save"
          content="Save"
          loading={formData.loading}
        />
      </Modal.Actions>
    </Modal>
  );
};

export default GetEditFieldModal;
