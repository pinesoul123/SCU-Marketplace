import { useState } from "react"
import ListingCard from "../components/ListingCard.jsx"
import "../styles/Market.css"

const count = 10;

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

function ListingsPage({listings, currentPage, itemsPerPage}) {
  const gallery = [];
  const startingIndex = currentPage * itemsPerPage;
  let endingIndex = (currentPage + 1) * itemsPerPage; //exclusive
  if (endingIndex > listings.length) {
    endingIndex = listings.length;
  }

  for (let i = startingIndex; i < endingIndex; i++) {
    gallery.push(<ListingCard listingId={listings[i]}></ListingCard>);
  }
  return (
    <div id="listings-container">
      {gallery}
    </div>
  )
}

export default function Market() {
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 2;

  const tempListings = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20];


  return (
    <div id="content">
      <h1>Market</h1>
      <ListingsPage listings={tempListings} currentPage={currentPage} itemsPerPage={itemsPerPage} />
      <Pagination itemList={tempListings} itemsPerPage={itemsPerPage} 
                  currentPage={currentPage} setCurrentPage={setCurrentPage} />
    </div>
  );
}