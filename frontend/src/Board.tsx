import { useState } from 'react';
import styles from './board.module.css';
import { BoardItem } from './types';


<<<<<<< HEAD
export function Board({ board, onClickWrap, clue }: { clue: string, onClickWrap: any, board: BoardItem[], boardSize: number }) {
=======
export function Board({ board, onClick }: { onClick: any, board: BoardItem[], boardSize: number }) {
>>>>>>> 757ab98 (front end board syncs with backend)
  const getTileStyle = (tile: BoardItem) => {
    return tile.answered ? styles.child + " " + styles.child_active : styles.child;
  }
  return (
    <div className="pt-14" style={{ maxWidth: '600px' }} >
<<<<<<< HEAD
      <h2 className="text-3xl font-semibold p-8" >{clue}</h2>
      <ul className={styles.parent}>
        {board.map((item, i) => {
          return (
            <li onClick={onClickWrap(item)} className={getTileStyle(item)} key={i}>
=======
      <h2 className="text-3xl font-semibold p-8" >The portion of the Earth composed primarily of iron and believed to be in a solid state.</h2>
      <ul className={styles.parent}>
        {board.map((item, i) => {
          return (
            <li onClick={onClick} className={getTileStyle(item)} key={i}>
>>>>>>> 757ab98 (front end board syncs with backend)
              {item.question}
            </li>
          );
        })}
      </ul>
    </div>
  )
}
