const Number = ({ number }) => {
  return (
    <div className="ml-5 flex flex-col text-center align-center justify-center mb-10">
      <div className="">
        <h1 className="text-9xl">{number}</h1><br/>

      </div>
      <h1 className=""> Charities Currently Registered</h1>
      {/* <h1 className="ml-5"></h1> */}
    </div>
  );
};

export default Number;
