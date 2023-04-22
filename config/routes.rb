Rails.application.routes.draw do
  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html

  # Defines the root path route ("/")

  root "pdfs#index"
  resources :pdfs, only: [:index] do
    member do
      post "ask"
    end
  end

end
