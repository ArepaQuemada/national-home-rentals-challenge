import React, { useEffect, useState } from 'react';
import { Service } from './Service';
import { useAsync } from "./hooks/useAsync";

function App() {
  
  const {
    asyncState: { data },
    doCallAdd,
    doCallDelete
  } = useAsync({ service: Service.getTenants, callOnLoad: true });

  const [formValues, setFormValues] = useState({
    nameInput: '',
    dateInput: '',
    selectStatus: 'CURRENT',
    showForm: false
  })

  const [filters, setActiveFilter] = useState('all')

  const filterMethods = {
    all: () => data,
    payment: () => data.filter(item => item.paymentStatus === 'LATE'),
    lease: () => {
      const monthsBtwnDates = (startDate, endDate) => {
        startDate = new Date(startDate);
        endDate = new Date(endDate);
          return Math.max(
            (endDate.getFullYear() - startDate.getFullYear()) * 12 +
              endDate.getMonth() -
              startDate.getMonth(),
            0
          )};
          return data.filter(item => monthsBtwnDates(Date.now(), item.leaseEndDate) === 0)
    }
  }

  const handleSave = (e) => {
    e.preventDefault()
    doCallAdd(Service.addTenant, {
      name: formValues.nameInput,
      paymentStatus: formValues.selectStatus,
      leaseEndDate: formValues.dateInput,
    });
  }

  const handleDelete = (id) => {
    doCallDelete(Service.deleteTenant, id)
  }

  const handleChangeForm = (e) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({ ...prev, [name]: value }))
  };

  const handleFilter = (e) => {
    setActiveFilter(e.target.name)
  }
  
  return (
    <>
      <div className="container">
        <h1>Tenants</h1>
        <ul className="nav nav-tabs" onClick={handleFilter}>
          <li className="nav-item" value='all'>
            <a className="nav-link active" href="#" name='all'>
              All
            </a>
          </li>
          <li className="nav-item">
            <a className="nav-link" href="#" name='payment'>
              Payment is late
            </a>
          </li>
          <li className="nav-item">
            <a className="nav-link" href="#" name='lease'>
              Lease ends in less than a month
            </a>
          </li>
        </ul>
        <table className="table">
          <thead>
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Payment Status</th>
              <th>Lease End Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {(filterMethods[filters]())?.map((item) => (
              <tr key={item.id}>
                <th>{item.id}</th>
                <td>{item.name}</td>
                <td>{item.paymentStatus}</td>
                <td>{item.leaseEndDate}</td>
                <td>
                  <button className="btn btn-danger" onClick={(e) => {
                    e.preventDefault()
                    handleDelete(item.id)
                  }}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="container">
        <button
          className="btn btn-secondary"
          onClick={() =>
            setFormValues((prev) => ({
              ...prev,
              showForm: true,
            }))
          }
        >
          Add Tenant
        </button>
      </div>
      <div className="container">
        {formValues.showForm && (
          <form>
            <div className="form-group">
              <label>Name</label>
              <input
                className="form-control"
                name="nameInput"
                value={formValues.nameInput}
                onChange={handleChangeForm}
              />
            </div>
            <div className="form-group">
              <label>Payment Status</label>
              <select
                className="form-control"
                name="selectStatus"
                onChange={handleChangeForm}
              >
                <option name="current" value="CURRENT">
                  CURRENT
                </option>
                <option name="late" value="LATE">
                  LATE
                </option>
              </select>
            </div>
            <div className="form-group">
              <label>Lease End Date</label>
              <input
                className="form-control"
                name="dateInput"
                value={formValues.dateInput}
                onChange={handleChangeForm}
              />
            </div>
            <button className="btn btn-primary" onClick={handleSave}>
              Save
            </button>
            <button className="btn">
              Cancel
            </button>
          </form>
        )}
      </div>
    </>
  );
}

export default App;
