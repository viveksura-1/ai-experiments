module OpenAi
    MAX_TOKENS_PER_REQUEST = 4000

    def self.get_text_embedding(text)
        payload = {
            input: text.gsub("\n", " ").split(" ").join(" "), 
            model: ENV['OPEN_AI_LLM']
        }

        headers = {
            content_type: "application/json", 
            authorization: "Bearer #{ENV['OPEN_AI_API_KEY']}"
        }
        
        api_response = RestClient.post("https://api.openai.com/v1/embeddings", payload.to_json, headers)
        embedding = JSON.parse(api_response)
        embedding
    end

    def self.get_answer_from_content(ranked_content, query)
        query += " ?" unless query.ends_with?("?")
        user_messages = []
        # making a default assumption that query consumes only 500 tokens at max 
        tokens_consumed = 500
        ranked_content.each do |content|
            #puts "content = #{content.inspect}"
            if tokens_consumed + content[:token_count] < MAX_TOKENS_PER_REQUEST
                user_messages.push(content[:text])
                tokens_consumed += content[:token_count]
            end
        end
        message = user_messages.join(" ") + query

        payload = {
            model: "gpt-3.5-turbo",
            messages: [{
                role: "user",
                content: message
            }],
            temperature: 0
        }

        headers = {
            content_type: "application/json", 
            authorization: "Bearer #{ENV['OPEN_AI_API_KEY']}"
        }

        api_response = RestClient.post("https://api.openai.com/v1/chat/completions", payload.to_json, headers)
        answer_object = JSON.parse(api_response)
        answer = (answer_object["choices"].first || {})["message"]["content"]
        answer
    end
end