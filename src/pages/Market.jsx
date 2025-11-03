import { useEffect, useState } from "react"
import ListingCard from "../components/ListingCard.jsx"
import { useSearchParams, useNavigate } from "react-router-dom";
import { listings } from "../api/listings";

import "../styles/Market.css"

async function getAllListings(searchQuery) {
  return (await listings.getAllIds(searchQuery));
}

function PaginationArrowButton({step, content, numOfPages, currentPage, setCurrentPage}) {
  function handleClick() {
        setCurrentPage(currentPage + step);
    }
    const button = <button className={"pagination-button"} onClick={handleClick}>{content}</button>
    // Back button, only renders if active page is not the first page
    if (step < 0) {
        if (currentPage !== 0) {
            return (button);
        }
    }
    // Next button, only renders if active page is not the last page
    if (step > 0) {
        if (currentPage !== numOfPages - 1) {
            return (button);
        }
    }
    return (<button className={"pagination-button inactive"}>{content}</button>);
}

function PaginationPageButton({pageIndex, currentPage, setCurrentPage}) {
  function handleClick() {
    setCurrentPage(pageIndex);
  }

  let pgButton = <button className={"pagination-button"} onClick={handleClick}>{pageIndex + 1}</button>
  if (currentPage === pageIndex) {
    pgButton = <button className={"pagination-button active"} onClick={handleClick}>{pageIndex + 1}</button>
  }

  return (pgButton)
}

function Pagination({itemList, itemsPerPage, currentPage, setCurrentPage}) {
  const numOfPages = Math.ceil(itemList.length/itemsPerPage);
  // Finds the range of pages available in pagination menu
  // We want to keep this at five pages total at all times tho
  // These are INDEXES not actual counting numbers btw
  let lowerBound = currentPage - 2;
  let upperBound = currentPage + 2; // upperBound is inclusive
  // currentPage is either 0 or 1
  if (lowerBound < 0) {
    lowerBound = 0;
    upperBound = 4;
  // currentPage is last page or second to last page
  } else if (upperBound > numOfPages - 1) {
    upperBound = numOfPages - 1;
    lowerBound = numOfPages - 5;
  }
  // Damage control
  if (lowerBound < 0) { lowerBound = 0; }
  if (upperBound > numOfPages - 1) { upperBound = numOfPages - 1; }
  

  const pagination = [];
  for (let i = lowerBound; i <= upperBound; i++) {
    pagination.push(<PaginationPageButton pageIndex={i} currentPage={currentPage} setCurrentPage={setCurrentPage} />)
  }
  
  return (
    <div className="pagination-container">
      <PaginationArrowButton step={-1} content={"<"} numOfPages={numOfPages} 
                             currentPage={currentPage} setCurrentPage={setCurrentPage} />
      {pagination}
      <PaginationArrowButton step={1} content={">"} numOfPages={numOfPages} 
                             currentPage={currentPage} setCurrentPage={setCurrentPage} />
    </div>
  )
}

function ListingsPage({searchQuery, itemsPerPage, currentPage, setCurrentPage}) {
  const navigate = useNavigate();
  const [listingDocs, setListingDocs] = useState([]);
  const getListingDocs = getAllListings(searchQuery);
  
  useEffect(() => {
    getListingDocs
    .then(listingDocs => {
      setListingDocs(listingDocs); 
    })
    .catch((error) => {
      navigate("/auth");
    });
  }, [])

  let renderedListings = listingDocs;
  if (renderedListings == null) {
    return;
  }

  // SEARCH ---------------------
  if ((searchQuery !== "") && (searchQuery !== null)) {
    renderedListings = listingDocs.filter(listing => listing.data().title.toLowerCase().includes(searchQuery.toLowerCase()))
  }

  // GETTING PAGE LIMIT ---------
  const gallery = [];
  const startingIndex = currentPage * itemsPerPage;
  let endingIndex = (currentPage + 1) * itemsPerPage; //exclusive
  if (endingIndex > renderedListings.length) {
    endingIndex = renderedListings.length;
  }

  // PUSHING ITEMS --------------
  for (let i = startingIndex; i < endingIndex; i++) {
    if (renderedListings[i] != null) {
      gallery.push(<ListingCard key={renderedListings[i].id} id={renderedListings[i].id} listingData={renderedListings[i].data()}></ListingCard>);
    }
  }


  return (
    <>
      <div id="listings-container">
        {gallery}
      </div>
      <Pagination itemList={renderedListings} itemsPerPage={itemsPerPage} 
                    currentPage={currentPage} setCurrentPage={setCurrentPage} />
    </>
  )
}

export default function Market() {
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 12;

  const [searchParams, setSearchParams] = useSearchParams();
  

  return (
    <div id="content">
      <h1>Market</h1>
      <ListingsPage searchQuery={searchParams.get("search")} itemsPerPage={itemsPerPage} currentPage={currentPage} setCurrentPage={setCurrentPage} />
    </div>
  );
}