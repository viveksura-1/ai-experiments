require 'cosine_similarity'

module PdfUtils
    def self.generate_embedding_from_file(filepath)
        pdf = PDF::Reader.new(filepath)
        file_embeddings = []
        
        pdf.pages.each_with_index do |page, index|
            page_text = page.text.gsub("\n", " ").split(" ").join(" ")
            if page_text.present?
                embedding = OpenAi.get_text_embedding(page_text)
                vector = embedding["data"].first["embedding"]
                token_count = embedding["usage"]["prompt_tokens"]
                file_embeddings.push("#{index}, #{token_count}, " + vector.join(', '))
            end
        end
        file_embeddings
    end

    def self.rank_page_text_query_similarity(query_text, file_embeddings)
        query_embedding = OpenAi.get_text_embedding(query_text.gsub("\n", " ").split(" ").join(" "))
        query_embedding_vector = query_embedding["data"].first["embedding"]
        search_similarity = []
        file_embeddings.each do |page|
            page_embedding = page.split(",")
            page_no = page_embedding.shift
            token_count = page_embedding.shift
            search_similarity.push([page_no.to_i, token_count.to_i, cosine_similarity(page_embedding.map(&:to_f), query_embedding_vector)])
        end
        search_similarity.sort_by! { |page_no, token_count, similarity| (-1 * similarity ) }
        search_similarity
    end

    def self.get_embeddings(pdf_file_path)
        pdf_name = pdf_file_path.split("/").last
        directory = pdf_file_path.gsub(pdf_name, "")
        embeddings_path = "#{directory}#{pdf_name.gsub(".pdf", ".embeddings.csv")}"
        if File.file?(embeddings_path)
            return File.read(embeddings_path).split("\n")
        else
            file_embeddings = generate_embedding_from_file(pdf_file_path)
            File.write(embeddings_path, file_embeddings.join("\n"), mode: "a")
            return file_embeddings
        end
    end

    def self.query_file(query, pdf_file_path)
        if File.file?(pdf_file_path)
            query = query.gsub("\n", " ").split(" ").join(" ")
            embeddings = get_embeddings(pdf_file_path)
            search_ranks = rank_page_text_query_similarity(query, embeddings)
            ranked_content = []
            pdf = PDF::Reader.new(pdf_file_path)
            search_ranks.each do |page_no, token_count, _similarity|
                ranked_content.push({
                    text: pdf.pages[page_no.to_i].text.gsub("\n", " ").split(" ").join(" "),
                    token_count: token_count.to_i
                })
            end

            answer = OpenAi.get_answer_from_content(ranked_content, query)
            answer
        end
    end
end