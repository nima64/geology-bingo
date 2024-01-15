Every time game state is changed we want broad cast update to players.

Changes occur when

- queque updates (broad cast to all)
- player's game board is updates(send to only player)

To Do

- turn Player interface into a class
- wrap board updates with calls to socket emits so we send changed to data to user who requested data
