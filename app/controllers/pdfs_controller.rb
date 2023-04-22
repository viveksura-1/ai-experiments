class PdfsController < ApplicationController
    #before_action :authenticate_user!
    PDFS = [
        { id: 1, public_url: "https://bitcoin.org/bitcoin.pdf", local_path: "files/bitcoin.pdf", name: "Bitcoin Whitepaper", thumbnail: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/46/Bitcoin.svg/800px-Bitcoin.svg.png" },
        { id: 2, public_url: "https://drive.google.com/file/d/154jwxq_5SkDzgdiFOMjatjjk3BKHqzcd/view?usp=share_link", local_path: "files/tdk.pdf", name: "The Dark Knight - Wiki", thumbnail: "https://upload.wikimedia.org/wikipedia/en/1/1c/The_Dark_Knight_%282008_film%29.jpg" },
        { id: 3, public_url: "https://drive.google.com/file/d/1QaUxObHlOq7Zg6quJxcY2IhOwadFgD-T/view?usp=share_link", local_path: "files/ssrajamouli.pdf", name: "SS Rajamouli - Wiki", thumbnail: "https://upload.wikimedia.org/wikipedia/commons/c/c1/SS_Rajamouli%2C_2021.jpg" }
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
