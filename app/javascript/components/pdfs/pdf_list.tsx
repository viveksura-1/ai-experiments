import React from "react";

class PdfList extends React.Component {
  state: {
    selectedBook: 1
  }

  props: {
    pdfs: any
  }

  onSelectPdf = (id) => {
    this.setState({selectedBook: id})
  }

  render() {
    return (
      <div>
        <h2 style={{textAlign: "center"}}> Ask a PDF </h2>
        <div className="grid">
          {
            this.props.pdfs.map((pdf) => {
              return (<div className="grid-item" style={{borderStyle: "solid", height: "330px"}} onClick={this.onSelectPdf.bind(this, pdf.id)} >
                  <img src={pdf.thumbnail} style={{display: "block", marginLeft: "auto", marginRight: "auto", height: "270px" }} />
                  <a href={pdf.public_url} style={{display: "block", marginLeft: "auto", marginRight: "auto", paddingTop: "20px", bottom: "5px"}} >
                    {pdf.name}
                  </a>
              </div>)
            })
          }
        </div>
      </div>
    );
  }
}

export default PdfList;