module Main exposing (..)
import Cards exposing(..)


import Browser
import Html exposing (..)
import Html.Events exposing (..)
import Random
import Html.Attributes exposing (..)
import Random.List exposing (shuffle)


-- MAIN


main =
  Browser.element
    { init = init
    , update = update
    , subscriptions = subscriptions
    , view = view
    }

-- MODEL

type alias Model = 
    { deck : List Card
    , phand : List Card
    , dhand : List Card
    , pscore : Int
    , dscore : Int
    , stay : Bool
    }


init : () ->  (Model, Cmd Msg)
init _ =
  ({ deck = []
   , phand = []
   , dhand = []
   , pscore = 0
   , dscore = 0
   , stay = False
  }, Random.generate Init <| Random.List.shuffle fulldeck
  )   

-- UPDATE

type Msg
  = Hit | Stay | Reset | Init (List Card)


update : Msg -> Model -> (Model, Cmd Msg)
update msg model =
  case msg of
    Hit -> if (deal model.phand model.deck 1 |> int_of_hand) < 21 then
        ({ deck = List.drop 1 model.deck
        , phand = deal model.phand model.deck 1
        , dhand = model.dhand
        , pscore 
          = model.pscore + (model.deck |> List.head |> Maybe.withDefault (Card Ace Spades) |> rank_of |> int_of_rank)
        , dscore = model.dscore
        , stay = False
        } , Cmd.none)
        else 
        ({ deck = List.drop 1 model.deck
        , phand = deal model.phand model.deck 1
        , dhand = dealer_hits model.dhand <| List.drop 1 model.deck
        , pscore = int_of_hand <| deal model.phand model.deck 1
        , dscore = int_of_hand <| dealer_hits model.dhand model.deck
        , stay = True
        }, Cmd.none)

    Stay -> 
        ({ deck = model.deck
        , phand = model.phand
        , dhand = dealer_hits model.dhand model.deck
        , pscore = model.pscore
        , dscore = int_of_hand <| dealer_hits model.dhand model.deck
        , stay = True
        }, Cmd.none)

    Init sdeck -> let
                    p = List.take 1 sdeck 
                    d = List.take 1 <| List.drop 1 sdeck
                  in
                  ({ deck = List.drop 2 sdeck
                   , phand = p
                   , dhand = d
                   , pscore = int_of_hand p
                   , dscore = int_of_hand d
                   , stay = False
                   }, Cmd.none)

    Reset -> ({ deck = []
              , phand = []
              , dhand = []
              , pscore = 0
              , dscore = List.foldl (\x acc -> acc + (rank_of x |> int_of_rank)) 0 <| List.take 2 fulldeck
              , stay = False
              }, Random.generate Init <| Random.List.shuffle fulldeck
             ) 
-- SUBSCRIPTIONS


subscriptions : Model -> Sub Msg
subscriptions model =
  Sub.none

-- VIEW

view : Model -> Html Msg
view model =
  div [] [
      h1 [id "title"] [text "Elm BlackJack"] ,
      ul [] [
          li [id "dscore"] [
            text "Dealer: ", String.fromInt model.dscore |> text],
          li [class "hand"] 
            <| display_hand_html <| List.reverse model.dhand,
          li [id "pscore"] 
            [ text "Player: ", String.fromInt model.pscore |> text],
          li [class "hand"] 
            <| display_hand_html <| List.reverse model.phand,
          li [] <| get_buttons model.stay
      ]
  ]
get_buttons : Bool -> List (Html Msg)
get_buttons stay = 
    if stay then
      [button [onClick Reset] [text "New Game"]]
    else
       [button [onClick Hit] [text "Hit"],
        button [onClick Stay] [text "Stay"]]

