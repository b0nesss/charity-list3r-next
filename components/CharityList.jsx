const CharityList = ({ name, agenda, cred }) => {
  return (
    <div>
      <h1>{name}</h1>
      <h2>{cred}</h2>
      <p>{agenda}</p>
    </div>
  );
};

export default CharityList;
