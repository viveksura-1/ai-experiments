class PdfsController < ApplicationController
    #before_action :authenticate_user!
    PDFS = [
        { id: 1, public_url: "", local_path: "files/bitcoin.pdf" },
        { id: 2, public_url: "", local_path: "files/tdk.pdf" },
        { id: 3, public_url: "", local_path: "files/ssrajamouli.pdf" }
    ]

    def index
        @pdfs = PDFS
    end

    def ask
        question = params[:question]
        pdf = PDFS.select { |pd| pd[:id] == params[:id].to_i }.first
        answer = "Answer Not Found. Please try asking another question."
        if question.present? && pdf.present?
            answer = PdfUtils.query_file(question, pdf[:local_path])
        end
        render json: {
            question: question,
            answer: answer
        }
    end
end
