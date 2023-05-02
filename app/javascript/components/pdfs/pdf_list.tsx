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
        <h1 className="text-3xl font-bold underline text-center m-5">
            Ask A PDF
        </h1>
        <div className="grid grid-cols-3 gap-4 m-5">
          {
            this.props.pdfs.map((pdf) => {
              let backgroundColor = (pdf.id == this.state.selectedId) ? "grey" : null;
              return (
              <div className="grid-item border-2 border-black outline-offset-8" onClick={this.onSelectPdf.bind(this, pdf.id)} style={{backgroundColor: backgroundColor}}>
                  <img src={pdf.thumbnail} className="h-64 mx-auto mt-5 mb-5" />
                  <a href={pdf.public_url} className="block text-center mb-5" >
                    {pdf.name}
                  </a>
              </div>
            )})
          }
        </div>
        <div className="max-w-xl mx-auto">
          <div className="font-bold text-center m-5">
            { "Ask a question about " + selectedPdf.name }
          </div>
          {
            this.state.isLoading ? 
              <p> Answer Loadings... </p> : 
              <div className="text-center block ">
                <textarea name="question" className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 mb-5" id="question" onChange={this.onTextChange.bind(this)}> </textarea>
                <button className="rounded-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={ this.askPdf.bind(this) } > Ask </button>
              </div>
          }
          {
            JSON.parse(JSON.stringify(this.state.responses)).reverse().map(response => {
              return (
                <div className="block mt-5" >
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