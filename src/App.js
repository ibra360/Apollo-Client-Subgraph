import { useEffect, useState } from "react";
import { gql, useQuery } from "@apollo/client";

// import axios from "axios";
import "./App.css";
import { client } from "./AplolloCient";

function App() {
  const SUBGRAPH_URL =
    "https://api.thegraph.com/subgraphs/name/kreatorland/kreatorland-testnet-v11";
  // const SUBGRAPH_URL = "https://api.thegraph.com/subgraphs/name/mutahhirkhan/social-blocks"
  const [data, setData] = useState([]);
  const [orderDirection, setOrderDirection] = useState("asc");
  const [orderBy, setOrderBy] = useState("itemId");
  const [loading, setLoading] = useState("itemId");
  const [skipValue, setSkipValue] = useState(0);
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(0);
  const [priceFilter, setPriceFilter] = useState(false);
  const [availability, setAvailability] = useState("");

  const LIMIT_PER_PAGE = 10;

  const getAllNfts = async () => {
    try {
      setLoading(true);
      let tokensQuery;
      console.log({ availability, priceFilter });
      if (priceFilter && !availability) {
        tokensQuery = `
  query {
    nfts(first:${LIMIT_PER_PAGE},skip:${skipValue},orderBy:"${orderBy}",orderDirection:"${orderDirection}",where: {price_lte:${maxPrice},price_gte:${minPrice}}){
      itemId
      price
      mintOnly
      description
      name
      tokenUri
      image
    }
  }
  `;
      } else if (availability && !priceFilter) {
        tokensQuery = `
  query {
    nfts(first:${LIMIT_PER_PAGE},skip:${skipValue},orderBy:"${orderBy}",orderDirection:"${orderDirection}",where: {mintOnly:${availability}}){
      itemId
      price
      mintOnly
      description
      name
      tokenUri
      image
    }
  }
  `;
      } else if (availability && priceFilter) {
        tokensQuery = `
  query {
    nfts(first:${LIMIT_PER_PAGE},skip:${skipValue},orderBy:"${orderBy}",orderDirection:"${orderDirection}",where: {mintOnly:${availability},price_lte:${maxPrice},price_gte:${minPrice}}){
      itemId
      price
      mintOnly
      description
      name
      tokenUri
      image
    }
  }
  `;
      } else {
        tokensQuery = `
  query {
    nfts(first:${LIMIT_PER_PAGE},skip:${skipValue},orderBy:"${orderBy}",orderDirection:"${orderDirection}"){
      itemId
      price
      mintOnly
      description
      name
      tokenUri
      image
    }
  }
  `;
      }
      client
        .query({
          query: gql(tokensQuery),
        })
        .then((data) => {
          console.log("Subgraph data: ", data);
          setData(data?.data?.nfts || []);
        })
        .catch((err) => {
          console.log("Error fetching data: ", err);
        });
      setLoading(false);
    } catch (e) {
      console.log({ e });
      setData([]);
      setLoading(false);
    }
  };

  useEffect(() => {
    // setSkipValue(0);
    getAllNfts();
  }, [orderDirection, orderBy, priceFilter, skipValue, availability]);

  const sortingButtons = () => {
    return (
      <div>
        <button
          onClick={() => {
            setOrderBy("price");
          }}
        >
          Price{" "}
        </button>
        <button
          onClick={() => {
            setOrderBy("itemId");
          }}
        >
          Item Id{" "}
        </button>
        <br />
        <button
          onClick={() => {
            orderDirection === "asc"
              ? setOrderDirection("desc")
              : setOrderDirection("asc");
          }}
        >
          {orderDirection === "desc" ? "Low to High" : " High to Low"}
        </button>
        <h2>
          Filtering By : {orderBy} (
          {orderDirection === "asc" ? "Low to High" : " High to Low"})
        </h2>
      </div>
    );
  };
  const priceField = () => {
    return (
      <div>
        <label for="quantity">Price Range</label>
        <input
          type="number"
          id="low"
          min="0"
          value={minPrice}
          onChange={(e) => {
            setMinPrice(e.target.value);
          }}
        ></input>
        <input
          type="number"
          id="high"
          min="1"
          value={maxPrice}
          onChange={(e) => {
            setMaxPrice(e.target.value);
          }}
        ></input>
        <button onClick={() => setPriceFilter(!priceFilter)}>
          {priceFilter ? "Remove Price Filter" : "Apply Price Filter"}{" "}
        </button>
      </div>
    );
  };
  const paginationButtons = () => {
    return (
      <div>
        <button
          onClick={() => {
            setSkipValue(+skipValue - LIMIT_PER_PAGE);
          }}
          disabled={!skipValue}
        >
          Previous Page
        </button>
        {console.log({ data })}
        <button
          onClick={() => {
            setSkipValue(+skipValue + LIMIT_PER_PAGE);
          }}
          disabled={data?.length < LIMIT_PER_PAGE}
        >
          Next Page
        </button>
      </div>
    );
  };
  const mappedData = () => {
    let res = data?.length ? (
      data?.map((item) => {
        return (
          <div
            style={{ backgroundColor: "grey", padding: "20px", margin: "20px" }}
          >
            <h1> {item?.name}</h1>
            {/* <img src={`${item.image}`} alt="nft image" /> */}
            <h2>Price : {item?.price}</h2>
            <h2>Item Id : {item?.itemId}</h2>
            <h2>Mint Only : {+item?.mintOnly}</h2>
          </div>
        );
      })
    ) : (
      <h1>No Data Found</h1>
    );
    console.log({ res, maxPrice });
    return res;
  };
  return (
    <div className="App" style={{ height: "100vh", padding: "20px" }}>
      {sortingButtons()}
      {priceField()}
      <div style={{ margin: "20px 0px" }}>
        <label for="cars">Availability:</label>
        <select
          id="cars"
          name="cars"
          onChange={(e) => setAvailability(e.target.value)}
        >
          <option value="">All</option>
          <option value="false">Buy Now</option>
          <option value="true">Not Listed</option>
        </select>
      </div>
      {paginationButtons()}
      {loading ? <h1>Loading, Please wait...</h1> : mappedData()}
    </div>
  );
}

export default App;
