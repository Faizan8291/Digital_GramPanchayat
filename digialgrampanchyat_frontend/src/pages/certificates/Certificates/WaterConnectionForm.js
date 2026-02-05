import { useState } from "react";

function WaterConnectionForm() {
  const [data, setData] = useState({
    applicantName: "",
    address: "",
    mobile: "",
    connectionType: "",
  });

  const handleChange = (e) =>
    setData({ ...data, [e.target.name]: e.target.value });

  const submit = (e) => {
    e.preventDefault();
    alert("Water Connection Application Submitted");
    console.log(data);
  };

  return (
    <div className="container mt-5">
      <h3>Water Connection Application</h3>

      <form onSubmit={submit}>
        <input className="form-control mb-3" name="applicantName" placeholder="Applicant Name" onChange={handleChange} />
        <textarea className="form-control mb-3" name="address" placeholder="Address" onChange={handleChange}></textarea>
        <input className="form-control mb-3" name="mobile" placeholder="Mobile Number" onChange={handleChange} />
        <select className="form-control mb-3" name="connectionType" onChange={handleChange}>
          <option value="">Select Connection Type</option>
          <option value="Domestic">Domestic</option>
          <option value="Commercial">Commercial</option>
        </select>

        <button className="btn btn-success">Submit</button>
      </form>
    </div>
  );
}

export default WaterConnectionForm;
