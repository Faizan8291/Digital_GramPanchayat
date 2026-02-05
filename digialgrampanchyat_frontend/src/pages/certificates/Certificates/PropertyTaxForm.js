import { useState } from "react";

function PropertyTaxForm() {
  const [data, setData] = useState({
    ownerName: "",
    propertyId: "",
    address: "",
    year: "",
  });

  const handleChange = (e) =>
    setData({ ...data, [e.target.name]: e.target.value });

  const submit = (e) => {
    e.preventDefault();
    alert("Property Tax Details Submitted");
    console.log(data);
  };

  return (
    <div className="container mt-5">
      <h3>Property Tax</h3>

      <form onSubmit={submit}>
        <input className="form-control mb-3" name="ownerName" placeholder="Owner Name" onChange={handleChange} />
        <input className="form-control mb-3" name="propertyId" placeholder="Property ID" onChange={handleChange} />
        <textarea className="form-control mb-3" name="address" placeholder="Property Address" onChange={handleChange}></textarea>
        <input className="form-control mb-3" name="year" placeholder="Tax Year" onChange={handleChange} />

        <button className="btn btn-success">Proceed</button>
      </form>
    </div>
  );
}

export default PropertyTaxForm;
