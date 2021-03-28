module Cards exposing(..)

import List exposing(..)
import Random exposing(..)
import Random.List exposing(..)
import Html.Attributes exposing (list)

type Suit = Spades | Hearts | Clubs | Diamonds

type Rank 
    = Ace
    | King
    | Queen
    | Jack
    | Num Int 

type Card = Card Rank Suit

int_of_suit : Suit -> Int
int_of_suit card = 
  case card of
    Spades -> 4

    Hearts -> 3

    Clubs -> 2

    Diamonds -> 1

int_of_rank : Rank -> Int
int_of_rank rank = 
    case rank of
    Ace -> 1

    King -> 10

    Queen -> 10

    Jack -> 10

    Num x -> x

int_of_hand : List Card -> Int
int_of_hand hand=
    List.foldl (\x acc -> acc + (rank_of x |> int_of_rank)) 0 hand
suit_of : Card -> Suit
suit_of (Card _ s) = s

rank_of : Card -> Rank
rank_of (Card r _) = r 

card_compare : Card -> Card -> Int
card_compare (Card r1 s1) (Card r2 s2) = 
    let 
      v1 = int_of_rank r1 
      v2 = int_of_rank r2 
    in
    if v1 /= v2 then v1 - v2
    else int_of_suit s1 - int_of_suit s2

cards_of_suit : Suit -> List Card
cards_of_suit s =
    List.map (\x -> Card (Num x) s) [2,3,4,5,6,7,8,9,10] ++
    List.map (\x -> Card x s) [Jack,King,Queen,Ace]
{--}

fulldeck : List Card
fulldeck =
    foldl (\x acc -> acc ++ cards_of_suit x) [] [Spades, Hearts, Diamonds, Clubs]
--}

deal : List Card -> List Card -> Int -> List Card
deal hand deck c 
    = if c > 0 then
        case deck of
            [] -> hand
            h::t -> deal (h::hand) t (c-1)
    else hand
    
display_card : Card -> String
display_card (Card rank suit) = case suit of
    Hearts -> 
        case rank of
            Num 2 -> "🂲" 
            Num 3 -> "🂳"
            Num 4 -> "🂴"
            Num 5 -> "🂵"
            Num 6 -> "🂶"
            Num 7 -> "🂷" 
            Num 8 -> "🂸" 
            Num 9 -> "🂹"
            Num 10 -> "🂺" 
            Jack -> "🂻" 
            Queen -> "🂽" 
            King -> "🂾" 
            Ace -> "🂱" 
            _ -> "🃏"
    Spades ->
        case rank of
            Num 2 -> "🂢" 
            Num 3 -> "🂣" 
            Num 4 -> "🂤" 
            Num 5 -> "🂥" 
            Num 6 -> "🂦" 
            Num 7 -> "🂧" 
            Num 8 -> "🂨" 
            Num 9 -> "🂩" 
            Num 10 -> "🂪" 
            Jack -> "🂫" 
            Queen -> "🂭" 
            King -> "🂮" 
            Ace -> "🃁" 
            _ -> "🃏"
    Diamonds ->
        case rank of 
            Num 2 -> "🃂"
            Num 3 -> "🃃" 
            Num 4 -> "🃄" 
            Num 5 -> "🃅" 
            Num 6 -> "🃆" 
            Num 7 -> "🃇" 
            Num 8 -> "🃈" 
            Num 9 -> "🃉" 
            Num 10 -> "🃊" 
            Jack -> "🃋" 
            Queen -> "🃍" 
            King -> "🃎" 
            Ace -> "🃑" 
            _ -> "🃏"
    Clubs ->
        case rank of 
            Num 2 -> "🃒" 
            Num 3 -> "🃓" 
            Num 4 -> "🃔"
            Num 5 -> "🃕" 
            Num 6 -> "🃖" 
            Num 7 -> "🃗" 
            Num 8 -> "🃘" 
            Num 9 -> "🃙" 
            Num 10 -> "🃚" 
            Jack -> "🃛" 
            Queen -> "🃝" 
            King -> "🃞"
            Ace -> "🃑"
            _ -> "🃏"


-- Displays a List of cards as a single string
display_hand : List Card -> String
display_hand hand =
    case hand of
       [] -> ""
       h::t -> display_card h ++ (display_hand t)

-- Dealer will hit until dHand >= 17 and then return the hand
dealer_hits : List Card -> List Card -> List Card
dealer_hits dHand deck =
    if int_of_hand dHand <= 17 then dealer_hits (List.take 1 deck |> List.append dHand) <| List.drop 1 deck
        else dHand

display_card_html : Card -> Html Msg
display_card_html (Card rank suit) = case suit of
    Hearts -> 
        case rank of
            Num 2 -> span [style "color" "red"] [text "🂲"] 
            Num 3 -> span [style "color" "red"] [text "🂳"]
            Num 4 -> span [style "color" "red"] [text "🂴"]
            Num 5 -> span [style "color" "red"] [text "🂵"]
            Num 6 -> span [style "color" "red"] [text "🂶"]
            Num 7 -> span [style "color" "red"] [text "🂷"]
            Num 8 -> span [style "color" "red"] [text "🂸"]
            Num 9 -> span [style "color" "red"] [text "🂹"]
            Num 10 -> span [style "color" "red"] [text "🂺"] 
            Jack -> span [style "color" "red"] [text "🂻"]
            Queen -> span [style "color" "red"] [text "🂽"]
            King -> span [style "color" "red"] [text "🂾"]
            Ace -> span [style "color" "red"] [text "🂱"] 
            _ -> span [style "color" "red"] [text "🃏"]
    Spades ->
        case rank of
            Num 2 -> text "🂢" 
            Num 3 -> text "🂣" 
            Num 4 -> text "🂤" 
            Num 5 -> text "🂥" 
            Num 6 -> text "🂦" 
            Num 7 -> text "🂧" 
            Num 8 -> text "🂨" 
            Num 9 -> text "🂩" 
            Num 10 -> text "🂪" 
            Jack -> text "🂫" 
            Queen -> text "🂭" 
            King -> text "🂮" 
            Ace -> text "🃁" 
            _ -> text "🃏"
    Diamonds ->
        case rank of 
            Num 2 -> span [style "color" "red"] [text "🃂"]
            Num 3 -> span [style "color" "red"] [text "🃃"]
            Num 4 -> span [style "color" "red"] [text "🃄"]
            Num 5 -> span [style "color" "red"] [text "🃅"]
            Num 6 -> span [style "color" "red"] [text "🃆"]
            Num 7 -> span [style "color" "red"] [text "🃇"]
            Num 8 -> span [style "color" "red"] [text "🃈"]
            Num 9 -> span [style "color" "red"] [text "🃉"]
            Num 10 -> span [style "color" "red"] [text "🃊"]
            Jack -> span [style "color" "red"] [text "🃋"]
            Queen -> span [style "color" "red"] [text "🃍"]
            King -> span [style "color" "red"] [text "🃎"]
            Ace -> span [style "color" "red"] [text "🃑"]
            _ -> span [style "color" "red"] [text "🃏"]
    Clubs ->
        case rank of 
            Num 2 -> text "🃒" 
            Num 3 -> text "🃓" 
            Num 4 -> text "🃔"
            Num 5 -> text "🃕" 
            Num 6 -> text "🃖" 
            Num 7 -> text "🃗" 
            Num 8 -> text "🃘" 
            Num 9 -> text "🃙" 
            Num 10 -> text "🃚" 
            Jack -> text "🃛" 
            Queen -> text "🃝" 
            King -> text "🃞"
            Ace -> text "🃑"
            _ -> text "🃏"

display_hand_html : List Card -> List (Html Msg)
display_hand_html lst =
    case lst of
       [] -> []
       h::t -> display_card_html h :: (display_hand_html t)