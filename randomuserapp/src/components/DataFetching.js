import React, { useState, useEffect } from "react";
import "../App.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import { UserContext } from "../UserContext";
//import ShortGender from './ShortGender'

function DataFetching(props) {
  const [searchUser, setSearchUser] = useState("");
  const [reset, setReset] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  let [values, setValues] = useState([]);
  const apiEndpoint = `https://randomuser.me/api/?results=10`;
  const userFetchResponse = useFetch(apiEndpoint, {
    isLoading: true,
    data: null
  });

  if (!userFetchResponse.data || userFetchResponse.isLoading) {
    return "Loading...";
  }

  values = userFetchResponse.data.results;
  setValues = userFetchResponse.data.results;
  const handleChange = event => {
    setSearchUser(event.target.value);
  };

  function useFetch(url, defaultResponse) {
    const [data, setData] = useState([]);
    async function getDataFromAPI() {
      try {
        const res = await fetch(url);
        const data = await res.json();
        setData({
          isLoading: false,
          data
        });
      } catch (e) {
        console.error(e);
        setData({
          isLoading: false,
          data: e
        });
      }
    }
    useEffect(() => {
      if (values.length === 0) getDataFromAPI();
      const filteredUser = values.filter(
        person =>
          person.name.first.toLowerCase().includes(searchUser.toLowerCase()) |
          person.name.last.toLowerCase().includes(searchUser.toLowerCase())
      );
      setSearchResults(filteredUser);
    }, [searchUser, reset]);
    return data;
  }

  if (searchResults.length === 0) setSearchResults(values);

  function handle_SortGender_Ascending(e) {
    e.preventDefault();
    const SortGender = values.sort((myfilteredContactsA, myfilteredContactsB) =>
      myfilteredContactsA.gender > myfilteredContactsB.gender ? 1 : -1
    );
    setSearchResults(SortGender);
    if (reset === 0) {
      setReset(1);
    } else {
      setReset(0);
    }
  }

  function handle_SortGender_Descending(e) {
    e.preventDefault();
    const SortGender = values.sort((myfilteredContactsA, myfilteredContactsB) =>
      myfilteredContactsA.gender < myfilteredContactsB.gender ? 1 : -1
    );
    setSearchResults(SortGender);
    if (reset === 1) {
      setReset(0);
    } else {
      setReset(1);
    }
  }

  function handle_SortAge_Ascending() {
    const SortAge = values.sort((myfilteredContactsA, myfilteredContactsB) =>
      myfilteredContactsA.dob.age > myfilteredContactsB.dob.age ? 1 : -1
    );
    setSearchResults(SortAge);
    setReset(1);
  }

  function handle_SortAge_Descending() {
    const SortAge = values.sort((myfilteredContactsA, myfilteredContactsB) =>
      myfilteredContactsA.dob.age < myfilteredContactsB.dob.age ? 1 : -1
    );
    setSearchResults(SortAge);
    setReset(0);
  }
  function handle_SortName_Ascending() {
    const SortName = values.sort((myfilteredContactsA, myfilteredContactsB) =>
      myfilteredContactsA.name.first > myfilteredContactsB.name.first ? 1 : -1
    );
    setSearchResults(SortName);
    setReset(1);
  }
  function handle_SortName_Descending() {
    const SortName = values.sort((myfilteredContactsA, myfilteredContactsB) =>
      myfilteredContactsA.name.first < myfilteredContactsB.name.first ? 1 : -1
    );
    setSearchResults(SortName);
    setReset(0);
  }

  function handleSubmit() {
    let inputdata = {
      gender: document.getElementById("gender").value,

      name: {
        title: "Mr",
        first: document.getElementById("firstname").value,
        last: document.getElementById("namelast").value
      },
      dob: {
        age: document.getElementById("age").value
      },
      picture: {
        large: "https://randomuser.me/api/portraits/men/86.jpg"
      },
      phone: document.getElementById("phone").value
    };

    values.push(inputdata);
    if (reset === 1) {
      setReset(0);
    } else {
      setReset(1);
    }
  }

  function handleRemove(e) {
    delete values[e];
    setSearchResults(values);
    if (reset === 1) {
      setReset(0);
    } else {
      setReset(1);
    }
  }
  return (
    <UserContext.Provider
      value={[
        values,
        setValues,
        searchResults,
        setSearchResults,
        reset,
        setReset
      ]}
    >
      <div className="App">
        <div className="users">
          <div className="user__searchInput">
            <input
              type="Search"
              placeholder="Search by name...."
              value={searchUser}
              onChange={handleChange}
            />
            <span className="user__sortby">
              <label> sort by :</label>
              {/*<ShortGender/>*/}
              <button onClick={handle_SortGender_Ascending}>Female</button>
              <button onClick={handle_SortGender_Descending}>Male</button>
              <button onClick={handle_SortAge_Ascending}>Age Acending</button>
              <button onClick={handle_SortAge_Descending}>Age Decending</button>
              <button onClick={handle_SortName_Ascending}>Name Acending</button>
              <button onClick={handle_SortName_Descending}>
                Name Decending
              </button>
            </span>
          </div>
        </div>
        <div>
          <div>
            <ul className="list_user">
              {searchResults.map(item => {
                return (
                  <div className="details" key={item.email}>
                    <div className="user__icon">
                      <img src={item.picture.large} alt="" />
                    </div>
                    <label className="details__label"> Name:</label>
                    <span>
                      {item.name.first}
                      {"  "}
                      {item.name.last}
                    </span>
                    <div>
                      <label className="details__label"> gender:</label>
                      <span>{item.gender}</span>
                    </div>
                    <div>
                      <label className="details__label"> Age:</label>
                      <span>{item.dob.age}</span>
                    </div>
                    <div>
                      <label className="details__label"> phone:</label>
                      <span>{item.phone}</span>
                    </div>
                    <FontAwesomeIcon
                      icon={faTrashAlt}
                      onClick={() => handleRemove(searchResults.indexOf(item))}
                    />
                  </div>
                );
              })}
            </ul>
          </div>
          <div>
            <h2>Add new user</h2>
            <form>
              <li>
                <label>Name First:</label>
                <input type="text" name="firstname" id="firstname" />
              </li>
              <li>
                <label>Last Name:</label>
                <input type="text" name="namelast" id="namelast" />
              </li>
              <li>
                <label>Gender :</label>
                <input type="text" name="Gender" id="gender" />
              </li>
              <li>
                <label>Age :</label>
                <input type="text" name="Age" id="age" />
              </li>
              <li>
                <label>Telephone:</label>
                <input type="text" name="Telephone" id="phone" />
              </li>
            </form>
            <botton type="botton" onClick={handleSubmit}>
              ADD
            </botton>
          </div>
        </div>
      </div>
    </UserContext.Provider>
  );
}
export default DataFetching;
