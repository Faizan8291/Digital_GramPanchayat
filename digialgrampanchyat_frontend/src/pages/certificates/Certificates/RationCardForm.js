import { useState } from "react";

function RationCardForm() {
  const [data, setData] = useState({
    headName: "",
    familyMembers: "",
    address: "",
    rationType: "",
  });

  const handleChange = (e) =>
    setData({ ...data, [e.target.name]: e.target.value });

  const submit = (e) => {
    e.preventDefault();
    alert("Ration Card Application Submitted");
    console.log(data);
  };

  return (
    <div className="container mt-5">
      <h3>Ration Card Application</h3>

      <form onSubmit={submit}>
        <input className="form-control mb-3" name="headName" placeholder="Head of Family Name" onChange={handleChange} />
        <input className="form-control mb-3" name="familyMembers" placeholder="No. of Family Members" onChange={handleChange} />
        <textarea className="form-control mb-3" name="address" placeholder="Address" onChange={handleChange}></textarea>
        <select className="form-control mb-3" name="rationType" onChange={handleChange}>
          <option value="">Select Ration Type</option>
          <option value="APL">APL</option>
          <option value="BPL">BPL</option>
        </select>

        <button className="btn btn-success">Submit</button>
      </form>
    </div>
  );
}

export default RationCardForm;
