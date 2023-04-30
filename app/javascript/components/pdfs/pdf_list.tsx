import React from "react";

class PdfList extends React.Component {
  state = {
    selectedId: 1,
    responses: [],
    nextQuestion: "",
    isLoading: false
  }

  props: {
    pdfs: any
  }

  onSelectPdf(id) {
    this.setState({selectedId: id});
  }

  onTextChange(event) {
    this.setState({nextQuestion: event.target.value});
  }

  askPdf() {
    if (this.state.nextQuestion.length > 0) {
      this.setState({nextQuestion: "", isLoading: true})
      const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: this.state.nextQuestion })
      };
      const url = `/pdfs/${this.state.selectedId}/ask`;
      fetch(url, requestOptions)
        .then(async response => {
          const isJson = response.headers.get('content-type')?.includes('application/json');
          const data = isJson && await response.json();
          let responses = JSON.parse(JSON.stringify(this.state.responses));
          responses.push(data);
          this.setState({responses: responses, isLoading: false});
        }).catch((error) => {
        })
    }
  }

  render() {
    let selectedPdf = this.props.pdfs.filter((pdf) => { return pdf.id == this.state.selectedId })[0];
    return (
      <div>
        <h1 className="text-3xl font-bold underline text-center">
            Ask A PDF
        </h1>
        <div className="grid">
          {
            this.props.pdfs.map((pdf) => {
              let backgroundColor = (pdf.id == this.state.selectedId) ? "grey" : null;
              return (
              <div className="grid-item" style={{borderStyle: "solid", height: "330px", backgroundColor: backgroundColor }} onClick={this.onSelectPdf.bind(this, pdf.id)} >
                  <img src={pdf.thumbnail} style={{display: "block", marginLeft: "auto", marginRight: "auto", height: "270px" }} />
                  <a href={pdf.public_url} style={{display: "block", marginLeft: "auto", marginRight: "auto", paddingTop: "20px", bottom: "5px"}} >
                    {pdf.name}
                  </a>
              </div>
            )})
          }
        </div>
        <div style={{display: "block", marginLeft: "auto", marginRight: "auto", padding: "50px", width: "50%"}} >
          <div style={{textAlign: "center", padding: "10px"}}>
            { "Ask a question about " + selectedPdf.name }
          </div>
          {
            this.state.isLoading ? 
              <p> Answer Loadings... </p> : 
              <>
                <textarea name="question" id="question" onChange={this.onTextChange.bind(this)}> </textarea>
                <button type="button" style={{display: "block", marginLeft: "auto", marginRight: "auto", marginTop: "20px"}} onClick={ this.askPdf.bind(this) } > Ask </button>
              </>
          }
          {
            JSON.parse(JSON.stringify(this.state.responses)).reverse().map(response => {
              return (
                <div style={{display: "block", marginLeft: "auto", marginRight: "auto", marginTop: "20px"}} >
                  <b> { response.question } </b>
                  <p> { response.answer } </p>
                </div>
              )
            })
          }
        </div>
        


      </div>
    );
  }
}

export default PdfList;